import { useEffect, useState, type ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import axios from "axios";
import "react-day-picker/dist/style.css";
import { handleError } from "../../utils/utils";
import { getAuthUser } from "../../utils/auth";
import { toast } from "react-toastify";
type Task = {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  dueDate: number;
  priority: string;
  userId: string;
  completedAt?: Date;
  status: string;
};

type Props = {
  onClose?: () => void;
  onTaskAdded?: (task: any) => void;
  initialTask?: Partial<Task>;
  projectId?: string | null;
};
type Project = {
  _id: string;
  title: string;
};
export default function AddNewTask({
  onClose,
  onTaskAdded,
  initialTask = {},
  projectId,
}: Props) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [priority, setPriority] = useState<string | null>(null);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const [projectSelected, setProjectSelected] =
    useState<string>("Select Project");
  const [task, setTask] = useState<Task>({
    _id: initialTask._id || "",
    title: initialTask.title || "",
    description: initialTask.description || "",
    dueDate: initialTask.dueDate || 12,
    status: initialTask.status || "to do",
    priority: initialTask.priority || "low",
    projectId: initialTask.projectId || "",

    userId: initialTask.userId || "",
  });
  useEffect(() => {
    if (initialTask) {
      if (initialTask.status) setStatus(initialTask.status);
      if (initialTask.priority) setPriority(initialTask.priority);
      if (initialTask.dueDate) setSelected(new Date(initialTask.dueDate));
      if (initialTask.status === "completed") {
        task.completedAt = new Date();
      }
    }
  }, [initialTask]);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };
  const closeAllDropdowns = () => {
    setIsStatusOpen(false);
    setIsPriorityOpen(false);
    setIsOpen(false);
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!status) {
      toast.error("Please select a status.");
      return;
    }
    if (!selected) {
      toast.error("Please select a due date.");
      return;
    }
    if (!projectSelected) {
      toast.error("Please select a project.");
      return;
    }
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    console.log("user from getAuthUser:", authUser);

    try {
      const payload = {
        title: task.title,
        description: task.description,
        status: status?.toLowerCase(),
        priority: priority?.toLowerCase(),
        userId: authUser.id,
        dueDate: selected?.toISOString(),
        projectId: projectId || task.projectId,
        completedAt: status?.toLowerCase() === "completed" ? new Date() : null,
      };

      if (!authUser || !authUser.token) {
        console.error("User not found or missing token. Please log in.");
        return;
      }
      console.log("🔑 Sending token:", authUser.token);
      let res;
      //update task
      if (task._id) {
        res = await axios.put(
          `http://localhost:3000/tasks/${task._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${authUser.token}` },
          }
        );
      } else {
        res = await axios.post("http://localhost:3000/tasks", payload, {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });
      }

      console.log("✅ Task created:", res.data);
      if (onTaskAdded) onTaskAdded(res.data);

      // Reset form
      setTask({
        _id: "",
        title: "",
        description: "",
        projectId: "",
        dueDate: 0,
        status: "to do",
        priority: "",
        userId: authUser.id,
      });
      setProjectSelected("Select Project");
      setPriority(null);
      setStatus(null);

      if (onClose) onClose();
    } catch (err: any) {
      handleError(err.message || "failed to create task");
      alert(err.response?.data?.error || "Something went wrong");
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
        const url = await axios.get("http://localhost:3000/projects", {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });
        setProjects(url.data);
      } catch (err: any) {
        handleError("Failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md p-2 rounded-xl"
    >
      {/* Title */}
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor="project"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Project
        </label>

        <div className="relative">
          {/* Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center w-full border border-[var(--border)] p-2.5 rounded-lg cursor-pointer bg-[var(--inside-card-bg)]"
          >
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {projectSelected}
            </span>
            <ChevronDown
              size={16}
              className={`text-[var(--light-text)] transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              <ul className="divide-y divide-[var(--border)]">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <li
                      key={project._id}
                      className="px-4 py-2 text-sm hover:bg-[var(--hover-bg)] cursor-pointer"
                      onClick={() => {
                        setProjectSelected(project.title);
                        setTask((prev) => ({
                          ...prev,
                          projectId: project._id,
                        }));
                        setIsOpen(false);
                      }}
                    >
                      {project.title}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-[var(--light-text)]">
                    No projects found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <label
          htmlFor="title"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Title
        </label>
        <input
          required
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                     focus:outline-none focus:ring-none"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor="description"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Description
        </label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          id="description"
          placeholder="Enter task details..."
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg resize-none 
                     focus:outline-none focus:ring-none focus:ring-[var(--accent-color)]"
          rows={3}
        ></textarea>
      </div>

      {/* Details */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Status Dropdown */}
        <div className="flex flex-col gap-1 w-full relative">
          <label
            htmlFor="status"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <button
            id="status"
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setIsStatusOpen((prev) => !prev);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border cursor-pointer
                       border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] 
                       ${
                         status
                           ? "text-[var(--primary-text)] "
                           : "text-[var(--light-text)] "
                       }
                        focus:ring-none focus:ring-[var(--accent-color)]`}
          >
            {status || "Select status"}
            <ChevronDown size={16} className="text-[var(--light-text)]" />
          </button>
          {isStatusOpen && (
            <div className="absolute z-10 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
              {["To Do", "In Progress", "Completed"].map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setIsStatusOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-[var(--primary-text)] hover:bg-[var(--hover-bg)] cursor-pointer"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Due Date Picker */}
        <div className="flex flex-col gap-1 w-full relative">
          <label
            htmlFor="dueDate"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Due Date <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setIsCalendarOpen((prev) => !prev);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border border-[var(--border)] cursor-pointer
                        rounded-lg bg-[var(--inside-card-bg)] 
                       ${
                         selected
                           ? "text-[var(--primary-text)]"
                           : "text-[var(--light-text)]"
                       }
                        focus:ring-none focus:ring-[var(--accent-color)]`}
          >
            {selected ? formatDate(selected) : "Select a date"}

            <ChevronDown size={16} className="text-[var(--light-text)]" />
          </button>
          {isCalendarOpen && (
            <div
              className="absolute z-20 -top-26 bg-[var(--bg)] border border-[var(--border)]
                            rounded-xl shadow-lg p-3 min-w-[280px] overflow-hidden"
            >
              <DayPicker
                mode="single"
                selected={selected || undefined}
                onSelect={(date) => {
                  setSelected(date || null);
                  setIsCalendarOpen(false);
                }}
                disabled={{ before: new Date() }}
                classNames={{
                  day_selected: "bg-[#8b5cf6] text-white rounded-full",
                  nav_button: "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                  nav_button_next:
                    "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                  nav_button_previous:
                    "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                }}
                className="rdp-weekdays-none"
              />
            </div>
          )}
        </div>
      </div>
      {/* Priority Dropdown */}
      <div className="flex flex-col gap-1 w-full relative">
        <label
          htmlFor="priority"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Priority <span className="text-red-500">*</span>
        </label>
        <button
          id="priority"
          type="button"
          onClick={() => {
            closeAllDropdowns();
            setIsPriorityOpen((prev) => !prev);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 border 
                border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] cursor-pointer 
                ${
                  priority
                    ? "text-[var(--primary-text)]"
                    : "text-[var(--light-text)]"
                }
                 focus:ring-none focus:ring-[var(--accent-color)]`}
        >
          {priority || "Select priority"}
          <ChevronDown size={16} className="text-[var(--light-text)]" />
        </button>
        {isPriorityOpen && (
          <div className="absolute z-10 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg ">
            {["Low", "Medium", "High"].map((p) => (
              <div
                key={p}
                onClick={() => {
                  setPriority(p);
                  setIsPriorityOpen(false);
                }}
                className="px-3 py-2 text-sm text-[var(--primary-text)] hover:bg-[var(--hover-bg)] cursor-pointer"
              >
                {p}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm hover:bg-[var(--accent-btn-hover-color)] bg-[var(--accent-color)]   text-white  shadow cursor-pointer"
        >
          {task._id ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

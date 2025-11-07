import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { handleError } from "../../utils/utils";
import axios from "axios";
type Project = {
  _id: string;
  title: string;
  description: string;
  inChargeName: string;
  role: string;
  priority: string;
  status: string;
  dueDate: string;
};
type Props = {
  onClose?: () => void;
  onProjectAdded?: (project: Project) => void;
  initialProject?: Partial<Project>;
};

export default function AddProjectModal({
  onClose,
  onProjectAdded,
  initialProject = {},
}: Props) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [priority, setPriority] = useState<string | null>(null);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const [project, setProject] = useState<Project>({
    _id: initialProject._id || "",
    title: initialProject.title || "",
    description: initialProject.description || "",
    dueDate: initialProject.dueDate || "",
    status: initialProject.status || "To Do",
    inChargeName: initialProject.inChargeName || "",
    role: initialProject.role || "",
    priority: initialProject.priority || "Low",
  });
  useEffect(() => {
    if (initialProject) {
      if (initialProject.status) setStatus(initialProject.status);
      if (initialProject.priority) setPriority(initialProject.priority);
      if (initialProject.dueDate) setSelected(new Date(initialProject.dueDate));
    }
  }, [initialProject]);

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return handleError("Please select a status.");
    if (!selected) return handleError("Please select a due date.");
    if (!priority) return handleError("Please select priority.");
    try {
      const payload = {
        title: project.title,
        description: project.description,
        dueDate: selected ? selected.toISOString() : null,
        role: project.role,
        status: status || project.status,
        inChargeName: project.inChargeName,
        priority: priority || project.priority,
        userId: authUser.id,
      };
      if (!authUser || !authUser.token) {
        console.error("User not found or missing token. Please log in.");
        return;
      }
      console.log("🔑 Sending token:", authUser.token);

      let res;

      if (project._id) {
        // 🛠️ Update existing project
        res = await axios.put(
          `http://localhost:3000/projects/${project._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${authUser.token}` },
          }
        );
      } else {
        // 🆕 Create new project
        res = await axios.post("http://localhost:3000/projects", payload, {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });
      }
      console.log("✅ Task created:", res.data);
      onProjectAdded?.(res.data);

      if (!project._id) {
        setProject({
          _id: "",
          title: "",
          description: "",
          dueDate: "",
          status: "To Do",
          inChargeName: "",
          role: "",
          priority: "Low",
        });
        setStatus(null);
        setPriority(null);
        setSelected(null);
      }
      console.log(res.data);
    } catch (error: any) {
      handleError(error.message || "Failed to create project");
    }
    console.log({ status, selected });

    onClose?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md  rounded-xl bg-[var(--bg)]"
    >
      {/* Title */}
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor="title"
          className="text-sm font-medium text-[var(--primary-text)] "
        >
          Project Title
        </label>
        <input
          required
          type="text"
          id="title"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          placeholder="Enter project title"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none focus:ring-violet-500"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor="description"
          className="text-sm font-medium text-[var(--primary-text)] "
        >
          Project Description
        </label>
        <textarea
          id="description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          placeholder="Enter project details..."
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-none focus:ring-violet-500"
          rows={3}
        />
      </div>

      {/* Incharge Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="incharge"
            className="text-sm font-medium text-[var(--primary-text)] "
          >
            Incharge Name
          </label>
          <input
            required
            type="text"
            id="incharge"
            value={project.inChargeName}
            onChange={(e) =>
              setProject({ ...project, inChargeName: e.target.value })
            }
            placeholder="Enter incharge name"
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none focus:ring-violet-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="role"
            className="text-sm font-medium text-[var(--primary-text)] "
          >
            Incharge Role
          </label>
          <input
            required
            type="text"
            id="role"
            value={project.role}
            onChange={(e) => setProject({ ...project, role: e.target.value })}
            placeholder="Enter incharge role"
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Status & Due Date */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Status Dropdown */}
        <div className="flex flex-col gap-1 w-full relative">
          <label
            htmlFor="status"
            className="text-sm font-medium text-[var(--primary-text)] "
          >
            Status <span className="text-red-500">*</span>
          </label>
          <button
            id="status"
            type="button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 border cursor-pointer border-[var(--border)] rounded-lg bg-[var(--cards-bg)] ${
              status ? "text-[var(--primary-text)]" : "text-[var(--light-text)]"
            }  focus:ring-none focus:ring-violet-500`}
            aria-label="Select status"
          >
            {status || "Select status"}
            <ChevronDown size={16} className="text-[var(--light-text)]" />
          </button>
          {isStatusOpen && (
            <div className="absolute z-20 top-16 right-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
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
            className="text-sm font-medium text-[var(--primary-text)] "
          >
            Due Date <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className={`w-full flex items-center justify-between  cursor-pointer px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] ${
              selected
                ? "text-[var(--primary-text)]"
                : "text-[var(--light-text)]"
            }  focus:ring-none focus:ring-violet-500`}
            aria-label="Select due date"
          >
            {selected ? formatDate(selected) : "Select a date"}
            <ChevronDown size={16} className="text-[var(--light-text)]" />
          </button>
          {isCalendarOpen && (
            <div className="absolute z-30 -top-34  bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg p-3 min-w-[280px]">
              <DayPicker
                mode="single"
                selected={selected || undefined}
                onSelect={(date) => {
                  setSelected(date || null);
                  setIsCalendarOpen(false);
                }}
                disabled={{ before: new Date() }}
                classNames={{
                  day_selected:
                    "bg-[var(--accent-color)] text-white rounded-full",
                  nav_button:
                    "text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] rounded p-1",
                  nav_button_next:
                    "text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)]rounded p-1",
                  nav_button_previous:
                    "text-[var(--accent-color)] hover:[var(--accent-btn-hover-color)] rounded p-1",
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
          className="text-sm font-medium text-[var(--primary-text)] "
        >
          Priority <span className="text-red-500">*</span>
        </label>
        <button
          id="priority"
          type="button"
          onClick={() => setIsPriorityOpen(!isPriorityOpen)}
          className={`w-full flex items-center cursor-pointer justify-between px-3 py-2 border 
                border-[var(--border)] rounded-lg bg-[var(--cards-bg)]
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
          <div className="absolute z-10 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
            {["Low", "Medium", "High"].map((p) => (
              <div
                key={p}
                onClick={() => {
                  setPriority(p);
                  setIsPriorityOpen(false);
                }}
                className="px-3 py-2 text-sm text-[var(--primary-text)]  cursor-pointer"
              >
                {p}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
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
          className="px-4 py-2 rounded-lg text-sm bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] shadow cursor-pointer"
        >
          {project._id ? "Update Project" : "Add Project"}
        </button>
      </div>
    </form>
  );
}

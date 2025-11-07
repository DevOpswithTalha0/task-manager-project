import axios from "axios";
import { useEffect, useState } from "react";
import { handleError } from "../../utils/utils";
import { Link } from "react-router-dom";
import AddNewTask from "../tasks/AddNewTask";
import { X } from "lucide-react";

type Task = {
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  status: "to do" | "in progress" | "completed";
};

export default function TasksCreatedToday() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const priorityColors: Record<Task["priority"], string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

      const res = await axios.get(
        `http://localhost:3000/tasks/recent?userId=${authUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (!res.data || res.data.length === 0) {
        handleError("No tasks found");
        setTasks([]);
        return;
      }

      setTasks(res.data);
    } catch (err: any) {
      console.error(err);
      handleError(err.response?.data?.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div className="flex flex-col justify-between p-4 pt-2.5 pb-3 border border-[var(--border)] rounded-2xl min-h-[261px] w-full bg-[var(--cards-bg)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 ">
        <p className="text-lg font-medium ">Recent Tasks</p>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer"
        >
          + Add Task
        </button>
        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 overflow-y-auto ">
            <div className="bg-[var(--bg)]  rounded-xl  w-[90%] max-w-md p-6 relative ">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-2 -right-2 bg-[var(--accent-color)] shadow-2xl rounded-full w-8.5 h-8.5 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Your Form */}
              <AddNewTask
                onClose={() => setIsOpen(false)}
                onTaskAdded={(newTask) => {
                  setTasks((prev) => {
                    const updated = [newTask, ...prev];

                    // Sort by dueDate (most recent first) and keep only 4
                    return updated
                      .sort(
                        (a, b) =>
                          new Date(b.dueDate || "").getTime() -
                          new Date(a.dueDate || "").getTime()
                      )
                      .slice(0, 4);
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table / Empty State */}
      <div className="overflow-x-auto flex-1">
        {loading ? (
          <p className="text-sm text-[var(--light-text)] text-center py-6">
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-[var(--light-text)] text-center py-6">
            No recent tasks found
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-[var(--light-text)] border-b border-[var(--border)]">
                <th className="py-2">Task Name</th>
                <th className="py-2">Due Date</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  className="text-sm text-[var(--light-text)] odd:bg-[var(--bg)] even:bg-[var(--inside-card-bg)] border-b border-[var(--border)]"
                >
                  <td className="py-2">{task.title}</td>
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="capitalize">
                    {task.status.replace("-", " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {tasks.length > 0 && (
        <div className="flex justify-end mt-3">
          <Link
            to={"/tasks"}
            className="text-sm text-[var(--accent-color)] hover:underline cursor-pointer"
          >
            See all tasks →
          </Link>
        </div>
      )}
    </div>
  );
}

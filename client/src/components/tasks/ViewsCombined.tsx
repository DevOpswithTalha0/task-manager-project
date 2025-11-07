import React, { useEffect, useState } from "react";
import { Search, List, LayoutGrid, Plus, X } from "lucide-react";
import BoardView from "./BoardView";
import ListView from "./ListView";
import AddNewTask from "./AddNewTask";
import axios from "axios";
import { handleError } from "../../utils/utils";
import type { Task } from "../../types/task";

export default function ViewsCombined() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEditTask = async (taskId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      setTaskToEdit(task);
      setIsOpen(true);
    }
  };

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const [viewMode, setViewMode] = useState<"board" | "list">(
    (params.get("view") as "board" | "list") || "board"
  );
  const [tasks, setTasks] = React.useState<any[]>([]);
  const filteredTasks = tasks.filter((task) =>
    [task.title, task.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const [loading, setLoading] = useState(true);
  const handleViewChange = (mode: "board" | "list") => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", mode);
      window.history.pushState({}, "", url);
    }
  };
  const mapStatus = (status: string): Task["status"] => {
    switch (status.toLowerCase()) {
      case "to do":
      case "to do":
        return "to do";
      case "in progress":
      case "in progress":
        return "in progress";
      case "completed":
        return "completed";
      default:
        return "to do"; // fallback
    }
  };
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log("🔑 Sending token:", authUser.token);

      const res = await axios.get(
        `http://localhost:3000/tasks?userId=${authUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );
      console.log("Tasks fetched:", res.data);
      const normalized = res.data
        .map((task: any) => ({
          ...task,
          status: mapStatus(task.status),
        }))
        .filter((t: Task) => !t.isTrashed);

      setTasks(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    try {
      const id = tasks.find((t) => t._id === taskId)?._id;
      if (!id) return handleError("Task not found in local state");
      console.log("🔑 Sending token from delete:", authUser.token);

      const res = await axios.put(
        `http://localhost:3000/tasks/${id}/trash`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${authUser.token}` } }
      );

      console.log("Delete response:", res.data);

      // Remove from local state
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err: any) {
      console.error("Delete error:", err.response || err);
      handleError(err.message || "Failed to delete task");
    }
  };
  // ✅ Fetch on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4  rounded-2xl flex flex-col w-full  border border-[var(--border)] ">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--light-text)] " />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search task..."
            className="border border-[var(--border-color)] pl-10 pr-3 py-2 rounded-xl w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm "
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
          {/* Toggle View */}
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange("list")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border  rounded-xl cursor-pointer ${
                viewMode === "list"
                  ? "bg-[var(--inside-card-bg)] border-[var(--accent-color)] text-[var(--accent-color)] "
                  : "border-[var(--border-color)] hover:bg-[var(--hover-bg)] "
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </button>

            <button
              onClick={() => handleViewChange("board")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-xl cursor-pointer ${
                viewMode === "board"
                  ? "bg-[var(--inside-card-bg)] border-[var(--accent-color)] text-[var(--accent-color)] "
                  : "border-[var(--border)] hover:bg-[var(--hover-bg)] "
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          {/* Add Project */}

          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsOpen(true);
            }}
            style={{ backgroundColor: "var(--accent-color)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--accent-btn-hover-color)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-color)")
            }
            className=" px-4 sm:px-5 py-2 flex items-center justify-center gap-1 rounded-full text-white text-sm shadow cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 overflow-y-auto ">
              <div className="bg-[var(--bg)]  rounded-xl  w-[90%] max-w-md p-6 relative ">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-2 -right-2 shadow-2xl rounded-full w-8.5 h-8.5 flex items-center justify-center  text-violet-900 hover:bg-[var(--accent-btn-hover-color)] bg-[var(--accent-color)]  cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Your Form */}
                <AddNewTask
                  onClose={() => setIsOpen(false)}
                  onTaskAdded={(newTask) => {
                    setTasks((prev) => {
                      const exists = prev.some((t) => t._id === newTask._id);
                      return exists
                        ? prev.map((t) => (t._id === newTask._id ? newTask : t))
                        : [...prev, newTask];
                    });
                  }}
                  initialTask={taskToEdit ?? undefined}
                />
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="overflow-x-auto">
        {viewMode === "board" ? (
          <BoardView
            tasks={filteredTasks}
            loading={loading}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            parentModalOpen={isOpen}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            loading={loading}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            parentModalOpen={isOpen}
          />
        )}
      </main>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import ActionDropdown from "./dropdown/ActionDropdown";
import type { Task } from "../../types/task";

type ListViewProps = {
  tasks: Task[];
  loading: boolean;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  parentModalOpen?: boolean;
  onTaskDeleted?: (taskId: string) => Promise<void>;
  onTaskEdited?: (taskId: string) => Promise<void>;
};

type ColumnProps = {
  title: "To Do" | "In Progress" | "Completed";
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  parentModalOpen?: boolean;
  onTaskEdited?: (taskId: string) => Promise<void>;
  onTaskDeleted?: (taskId: string) => Promise<void>;
};

function TaskColumn({
  title,
  tasks,
  setTasks,
  parentModalOpen,
  onTaskEdited,
}: ColumnProps) {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

  // dropdown management
  const [dropdownTaskId, setDropdownTaskId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // table state
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // colors
  const dotColor =
    title === "To Do"
      ? "bg-violet-500"
      : title === "In Progress"
      ? "bg-yellow-500"
      : "bg-green-500";

  // computed values
  const allSelected = tasks.length > 0 && selectedItems.length === tasks.length;

  const handleDeleteTask = async (taskId: string) => {
    try {
      const id = tasks.find((t) => t._id === taskId)?._id;
      if (!id) return toast("Task not found");

      await axios.put(
        `http://localhost:3000/tasks/${id}/trash`,
        {},
        { headers: { Authorization: `Bearer ${authUser.token}` } }
      );

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task moved to trash");
    } catch (err: any) {
      console.error("Delete error:", err.response || err);
      toast.error(err.message || "Failed to delete task");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? tasks.map((t) => t._id) : []);
  };

  const handleSelect = (taskId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, taskId] : prev.filter((id) => id !== taskId)
    );
  };

  const handleCancelSelection = () => setSelectedItems([]);

  // open dropdown near button
  const openDropdown = (e: React.MouseEvent, taskId: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const dropdownWidth = 150;
    const spaceRight = window.innerWidth - rect.right;

    const left =
      spaceRight > dropdownWidth
        ? rect.right + window.scrollX
        : rect.left - dropdownWidth + window.scrollX;

    setDropdownTaskId(taskId);
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left,
    });
  };

  const closeDropdown = () => setDropdownTaskId(null);

  // click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        closeDropdown();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close dropdown when column collapses or modal opens
  useEffect(() => {
    if (!isOpen || parentModalOpen) closeDropdown();
  }, [isOpen, parentModalOpen]);

  return (
    <div className="w-full flex flex-col gap-3 p-4 border border-[var(--border)] rounded-2xl">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className={`w-3 h-3 rounded-full ${dotColor}`} />
          <button className="font-semibold">{title}</button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--light-text)] hover:text-gray-700 transition-transform"
          >
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Table */}
      {isOpen && (
        <main className="overflow-x-auto animate-fadeIn relative">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--inside-card-bg)] text-[var(--light-text)]">
                <th className="p-2 text-center w-10">
                  <input
                    type="checkbox"
                    className="accent-[var(--accent-color)] cursor-pointer"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-2 text-center">Task Name</th>
                <th className="p-2 text-center">Due Date</th>
                <th className="p-2 text-center">Priority</th>
                <th className="p-2 text-center w-12">Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-[var(--light-text)]"
                  >
                    No tasks in this section
                  </td>
                </tr>
              ) : (
                tasks.map((task, i) => (
                  <tr
                    key={task._id}
                    className={`text-center ${
                      i % 2 === 0
                        ? "bg-[var(--bg)]"
                        : "bg-[var(--inside-card-bg)]"
                    } ${
                      i !== tasks.length - 1
                        ? "border-b border-[var(--border)]"
                        : ""
                    }`}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        className="accent-[var(--accent-color)] cursor-pointer"
                        checked={selectedItems.includes(task._id)}
                        onChange={(e) =>
                          handleSelect(task._id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No due date"}
                    </td>
                    <td
                      className={`p-2 font-medium ${
                        task.priority === "high"
                          ? "text-red-500"
                          : task.priority === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {task.priority
                        ? task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)
                        : "N/A"}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={(e) => openDropdown(e, task._id)}
                        className="text-[var(--light-text)] hover:text-gray-700 cursor-pointer"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Floating Action Bar */}
          {selectedItems.length > 0 && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--cards-bg)] border border-[var(--border)] shadow-lg px-6 py-3 rounded-xl flex gap-4 items-center animate-fadeIn z-[999] backdrop-blur-sm">
              <p className="text-sm text-[var(--primary-text)]">
                {selectedItems.length} selected
              </p>
              <button
                className="px-3 py-1.5 text-sm bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] text-[var(--primary-text)]"
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  selectedItems.forEach(handleDeleteTask);
                  setSelectedItems([]);
                }}
              >
                Delete
              </button>
            </div>
          )}

          {/* Dropdown Menu */}
          {dropdownTaskId && (
            <div
              className="fixed z-[99999] animate-fadeIn"
              ref={dropdownRef}
              style={{
                top: dropdownPosition.top + 4,
                left: dropdownPosition.left,
              }}
            >
              <ActionDropdown
                onEditTask={() => onTaskEdited?.(dropdownTaskId)}
                onDeleteTask={() => {
                  handleDeleteTask(dropdownTaskId);
                  closeDropdown();
                }}
              />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default function ListView({
  tasks,
  loading,
  setTasks,
  parentModalOpen,
  onTaskDeleted,
  onTaskEdited,
}: ListViewProps) {
  if (loading) return <p className="text-center">Loading tasks...</p>;

  return (
    <div className="flex flex-col gap-6">
      <TaskColumn
        title="To Do"
        tasks={tasks.filter((t) => t.status === "to do")}
        setTasks={setTasks}
        parentModalOpen={parentModalOpen}
        onTaskDeleted={onTaskDeleted}
        onTaskEdited={onTaskEdited}
      />
      <TaskColumn
        title="In Progress"
        tasks={tasks.filter((t) => t.status === "in progress")}
        setTasks={setTasks}
        parentModalOpen={parentModalOpen}
        onTaskDeleted={onTaskDeleted}
        onTaskEdited={onTaskEdited}
      />
      <TaskColumn
        title="Completed"
        tasks={tasks.filter((t) => t.status === "completed")}
        setTasks={setTasks}
        parentModalOpen={parentModalOpen}
        onTaskDeleted={onTaskDeleted}
        onTaskEdited={onTaskEdited}
      />
    </div>
  );
}

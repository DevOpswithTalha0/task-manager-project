import React, { use, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, X } from "lucide-react";
import axios from "axios";
import { handleError } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import AddNewTask from "./AddNewTask";
import ActionDropdown from "./dropdown/ActionDropdown";
import type { Task } from "../../types/task";
type Props = {
  tasks: Task[];
  loading: boolean;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // <--- get from parent
  onTaskDeleted?: (taskId: string) => Promise<void>;
  onTaskEdited?: (taskId: string) => Promise<void>;
  parentModalOpen?: boolean;
};

export default function BoardView({
  tasks,
  loading,
  setTasks,
  onTaskDeleted,
  onTaskEdited,
  parentModalOpen,
}: Props) {
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDropdownOpen, setDropdownIsOpen] = useState(false);

  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownTaskId, setDropdownTaskId] = useState<string | null>(null);
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });
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
  const handleCancel = () => {
    setSelectedItems([]);
  };
  const openDropdown = (e: React.MouseEvent, taskId: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const dropdownWidth = 150; // Approximate width of the dropdown

    const spaceRight = window.innerWidth - rect.right;
    const left =
      spaceRight > dropdownWidth
        ? rect.right + window.scrollX
        : rect.left - dropdownWidth + window.scrollX;
    setDropdownTaskId(taskId);
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: left,
    });
  };

  const closeDropdown = () => setDropdownTaskId(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  useEffect(() => {
    if (isOpen || parentModalOpen) setDropdownTaskId(null);
  }, [isOpen, parentModalOpen]);

  const columns = [
    {
      id: "to do",
      title: "To Do",
      color: "border-l-violet-500",
      dot: "bg-violet-500",
    },
    {
      id: "in progress",
      title: "In Progress",
      color: "border-l-yellow-500",
      dot: "bg-yellow-500",
    },
    {
      id: "completed",
      title: "Completed",
      color: "border-l-green-500",
      dot: "bg-green-500",
    },
  ];

  // Helper: reorder list
  const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    setTasks((prev) => {
      const sourceTasks = prev.filter(
        (task) => task.status === source.droppableId
      );

      // Moving within the same column
      if (source.droppableId === destination.droppableId) {
        const reordered = reorder(sourceTasks, source.index, destination.index);
        return prev.map((task) =>
          task.status !== source.droppableId
            ? task
            : reordered.find((t) => t._id === task._id) || task
        );
      }

      // Moving across columns
      const newStatus = destination.droppableId as Task["status"];

      // Optimistic update
      const updatedTasks = prev.map((task) =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      );

      // Persist to backend
      axios
        .patch(
          `http://localhost:3000/tasks/${draggableId}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        )
        .catch((err) => {
          handleError(err.message || "Failed to update task status");
          // ❌ revert back if error
          setTasks(prev);
        });

      return updatedTasks;
    });
  };

  if (loading) {
    return <p className="text-center py-6">Loading tasks...</p>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative">
        {columns.map((col) => {
          const filteredTasks = tasks.filter((task) => task.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${col.dot}`}></span>
                  <h2 className="font-semibold ">{col.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-[var(--accent-color)] cursor-pointer"
                    checked={
                      filteredTasks.length > 0 &&
                      filteredTasks.every((task) =>
                        selectedItems.includes(task._id)
                      )
                    }
                    onClick={() => setDropdownIsOpen(!isDropdownOpen)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const taskIds = filteredTasks.map((task) => task._id);

                      setSelectedItems(
                        (prev) =>
                          isChecked
                            ? Array.from(new Set([...prev, ...taskIds])) // Add all from this column
                            : prev.filter((id) => !taskIds.includes(id)) // Remove all from this column
                      );
                    }}
                  />
                </div>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-3 flex-1 min-h-[100px] max-h-[600px] overflow-y-auto relative z-0"
                  >
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                transform: snapshot.isDragging
                                  ? provided.draggableProps.style?.transform
                                  : "none",
                                transition: snapshot.isDragging
                                  ? "transform 0.1s ease"
                                  : undefined,
                                zIndex: snapshot.isDragging ? 9999 : "auto",
                                position: snapshot.isDragging
                                  ? "relative"
                                  : "static",
                              }}
                              className={`bg-[var(--inside-card-bg)] rounded-lg shadow-sm border border-[var(--border)] p-3 border-l-4 ${
                                col.color
                              } ${
                                snapshot.isDragging
                                  ? "shadow-xl scale-[1.03] border-l-8"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium ">
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(task._id)}
                                    onChange={() => {
                                      setSelectedItems((prev) =>
                                        prev.includes(task._id)
                                          ? prev.filter((id) => id !== task._id)
                                          : [...prev, task._id]
                                      );
                                    }}
                                    className="accent-[var(--accent-color)] cursor-pointer"
                                  />
                                  <button
                                    className="text-[var(--light-task)] hover:text-[var(--primary-text)] cursor-pointer"
                                    onClick={(e) => openDropdown(e, task._id)}
                                  >
                                    <MoreHorizontal size={16} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs  mb-2">
                                {task.description || "No description"}
                              </p>
                              <div className="flex justify-between text-xs text-[var(--light-text)]">
                                <p>
                                  {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )
                                    : "No due date"}
                                </p>
                                <p
                                  className={`font-medium ${
                                    task.priority === "high"
                                      ? "text-[var(--high-priority-color)]"
                                      : "text-[var(--light-text)]"
                                  }`}
                                >
                                  {task.priority?.toLocaleUpperCase() || "—"}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--light-text)] italic text-center py-4">
                        No tasks yet
                      </p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Add Task Button */}
              <button
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[var(--accent-color)] cursor-pointer text-[var(--primary-text)]   rounded-lg  transition"
                onClick={() => {
                  setDropdownTaskId(null);
                  setTimeout(() => setIsOpen(true), 0); // ensures dropdown closes before modal renders
                }}
                onMouseEnter={(e) => (
                  (e.currentTarget.style.backgroundColor =
                    "var(--accent-btn-hover-color)"),
                  (e.currentTarget.style.color = "white")
                )}
                onMouseLeave={(e) => (
                  (e.currentTarget.style.backgroundColor = "transparent"),
                  (e.currentTarget.style.color = "var(--primary-text)")
                )}
              >
                <Plus size={16} />
                <span className="text-sm font-medium">Add Task</span>
              </button>
              {/* Modal */}
            </div>
          );
        })}
        {/* Floating Action Bar */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--cards-bg)] border border-[var(--border)] shadow-lg px-6 py-3 rounded-xl flex gap-4 items-center animate-fadeIn z-50">
            <p className="text-sm text-[var(--primary-text)]">
              {selectedItems.length} selected
            </p>
            <button
              className="px-3 py-1.5 text-sm bg-[var(--inside-card-bg)]  rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer text-[var(--primary-text)] "
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 text-sm cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => {
                // Delete selected tasks
                selectedItems.forEach((taskId) => {
                  handleDeleteTask(taskId);
                });
                // Clear selection
                setSelectedItems([]);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {dropdownTaskId && (
        <div
          className="fixed   z-[99999]"
          ref={dropdownRef}
          style={{
            top: dropdownPosition.top + 2,
            left: dropdownPosition.left,
          }}
        >
          <ActionDropdown
            onEditTask={() => onTaskEdited?.(dropdownTaskId)}
            onDeleteTask={() => {
              onTaskDeleted?.(dropdownTaskId!);
              closeDropdown();
            }}
          />
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 overflow-y-auto ">
          <div className="bg-white  rounded-xl  w-[90%] max-w-md p-6 relative ">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 bg-[var(--accent-color)] shadow-2xl rounded-full w-8.5 h-8.5 flex items-center justify-center text-violet-900 hover:bg-[var(--accent-btn-hover-color)] cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Your Form */}
            <AddNewTask
              onClose={() => setIsOpen(false)}
              onTaskAdded={(newTask) => {
                setTasks((prev) => [...prev, newTask]);
              }}
            />
          </div>
        </div>
      )}
    </DragDropContext>
  );
}

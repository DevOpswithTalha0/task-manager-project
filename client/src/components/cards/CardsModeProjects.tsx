// CardsModeProjects.tsx

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import ProjectDetails from "../projects/ProjectDetails";
import ActionDropdown from "../projects/dropdown/ActionDropdown";

// --- START: Props Definition (Must match the parent) ---
type Project = {
  _id: string;
  title: string;
  status?: string;
  dueDate?: string;
  inChargeName?: string;
  isTrashed?: boolean;
  role?: string;
  completedTasks?: number;
  totalTasks?: number;
  progress?: number;
};

type CardsModeProps = {
  currentProjects: Project[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onDeleteProject: (projectId: string) => Promise<void>;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setIsProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProjectId: string | null;
  editProject: Project | null;
  handleProjectAdded: (newProject: Project) => void;
  onOpenAddTask: (projectId: string) => void;
};
// --- END: Props Definition ---

export default function CardsModeProjects({
  currentProjects,
  totalPages,
  currentPage,
  setCurrentPage,
  onDeleteProject,
  setSelectedProjectId,
  setEditProject,
  setIsProjectModalOpen,
  selectedProjectId,
  onOpenAddTask,
}: CardsModeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (id: string) => {
    setIsDropdownOpen(isDropdownOpen === id ? null : id);
  };

  // Cleanup effect for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setIsProjectModalOpen(true);
    setIsDropdownOpen(null);
  };

  return (
    <div>
      {/* Cards */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentProjects.length === 0 && totalPages === 1 ? (
          <div className="col-span-full text-center  text-gray-500 ">
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm mt-2">
              Start by adding a new project to see it here.
            </p>
          </div>
        ) : (
          currentProjects.map((item, index) => (
            <div
              key={item._id || index}
              className={`flex flex-col gap-3 rounded-xl p-4 shadow-sm transition ${
                index % 2 === 0
                  ? "bg-[var(--cards-bg)] border border-[var(--border)]"
                  : "bg-[var(--bg)] border border-[var(--border)]"
              }`}
            >
              {/* Header */}
              <header className="flex justify-between items-center">
                <button
                  className="font-medium text-base text-left  hover:underline cursor-pointer"
                  onClick={() => setSelectedProjectId(item._id)}
                >
                  {item.title}
                </button>
                <div className="flex gap-2 justify-center items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-600 border border-gray-200"
                        : item.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600 border border-gray-200"
                        : "bg-gray-300 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {item.status}
                  </span>
                  <div
                    className="relative "
                    onClick={() => toggleDropdown(item._id)}
                  >
                    <button className="cursor-pointer">
                      <MoreHorizontal size={18} />
                    </button>
                    {isDropdownOpen == item._id && (
                      <div
                        className="absolute top-4 z-50 bg-[var(--bg)] right-0 shadow-lg rounded-md border border-[var(--border)]"
                        ref={dropdownRef}
                      >
                        <ActionDropdown
                          onViewDetails={() => {
                            setSelectedProjectId(item._id);
                            setIsDropdownOpen(null);
                          }}
                          onEditProject={() => handleEdit(item)}
                          onAddTask={() => {
                            onOpenAddTask(item._id);
                            setIsDropdownOpen(null);
                          }}
                          onDeleteProject={() => {
                            onDeleteProject(item._id);
                            setIsDropdownOpen(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* Info */}
              <section className="grid grid-cols-2 gap-3 text-sm ">
                <div>
                  <p className="text-[var(--light-text)] ">Incharge</p>
                  <p className="font-medium">{item.inChargeName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[var(--light-text)] ">Role</p>
                  <p className="font-medium">{item.role || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[var(--light-text)] ">Tasks</p>
                  <p className="font-medium">
                    {item.completedTasks || 0}/{item.totalTasks || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Deadline</p>
                  <p className="font-medium">
                    {item.dueDate
                      ? new Date(item.dueDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </section>

              {/* Progress */}
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <p className="text-[var(--light-text)]  ">Progress</p>
                  <p className="font-medium">
                    {" "}
                    {item.totalTasks && item.totalTasks > 0
                      ? Math.round(
                          ((item.completedTasks || 0) / item.totalTasks) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="h-2 w-full bg-[var(--inside-card-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-color)] rounded-full transition-all"
                    style={{
                      width: `${
                        item.totalTasks && item.totalTasks > 0
                          ? Math.round(
                              ((item.completedTasks || 0) / item.totalTasks) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Footer */}
              <footer className="flex gap-2 mt-2">
                <button
                  className="flex-1 border border-[var(--border)] rounded-lg py-2 text-sm hover:bg-[var(--hover-bg)] cursor-pointer"
                  onClick={() => setSelectedProjectId(item._id)}
                >
                  View Details
                </button>

                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 border relative border-[var(--border)] text-[var(--accent-color)] rounded-lg py-2 text-sm hover:bg-[var(--accent-btn-hover-color)] cursor-pointer hover:text-white "
                >
                  Edit Info
                </button>
              </footer>
            </div>
          ))
        )}
      </main>

      {/* Render ProjectDetails */}
      {selectedProjectId && (
        <ProjectDetails
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* Pagination (now uses props) */}
      <footer className="flex justify-between items-center mt-6 text-sm text-[var(--light-text)] ">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-[var(--border)] cursor-pointer rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded-lg border border-[var(--border)] ${
                num === currentPage
                  ? "bg-[var(--accent-color)] text-white border-[var(--accent-btn-hover-color)]"
                  : "hover:bg-[var(--hover-bg)]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-[var(--border)] cursor-pointer rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </footer>
    </div>
  );
}

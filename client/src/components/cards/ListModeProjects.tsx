// ListModeProjects.tsx

import { useState, useRef, useEffect } from "react";
import ProjectDetails from "../projects/ProjectDetails";
import { MoreHorizontal } from "lucide-react";
import ActionDropdown from "../projects/dropdown/ActionDropdown";

// --- START: Props Definition (Must match the parent) ---
type Project = {
  _id: string;
  title: string;
  status?: string;
  dueDate?: string;
  inChargeName?: string;
  isTrashed?: boolean;
};

type ListModeProps = {
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
};
// --- END: Props Definition ---

export default function ListModeProjects({
  currentProjects,
  totalPages,
  currentPage,
  setCurrentPage,
  onDeleteProject,
  setSelectedProjectId,
  setEditProject,
  setIsProjectModalOpen,
  selectedProjectId,
}: ListModeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  const [isSmScreenDropdownOpen, setIsSmScreenDropdownOpen] = useState<
    string | null
  >(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const smDropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // ... (Desktop dropdown positioning logic remains the same)
    if (isDropdownOpen === id) {
      setIsDropdownOpen(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const dropdownWidth = 164;

      const spaceRight = window.innerWidth - rect.right;
      const left =
        spaceRight > dropdownWidth
          ? rect.right + window.scrollX
          : rect.left - dropdownWidth + window.scrollX;

      setDropdownPosition({
        top: rect.top + window.scrollY,
        left,
      });

      setIsDropdownOpen(id);
    }
  };

  const toggleSmDropdown = (id: string) => {
    setIsSmScreenDropdownOpen(isSmScreenDropdownOpen === id ? null : id);
  };

  // Clean up effect for desktop dropdown
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

  // Clean up effect for mobile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        smDropdownRef.current &&
        !smDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSmScreenDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setIsProjectModalOpen(true);
    setIsDropdownOpen(null);
    setIsSmScreenDropdownOpen(null);
  };

  return (
    <div className="w-full">
      {currentProjects.length === 0 && totalPages === 1 ? (
        <div className="text-center text-[var(--light-text)]">
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm mt-2">
            Start by adding a new project to see it here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--inside-card-bg)] text-[var(--light-text)] text-left text-sm font-medium">
                  <th className="px-4 py-2">Project</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">In Charge</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project, idx) => (
                  <tr
                    key={project._id}
                    className={`border-b border-[var(--border)] ${
                      idx % 2 === 1 ? "bg-[var(--inside-card-bg)]" : ""
                    }`}
                  >
                    <td className="py-2 px-4 font-medium text-left">
                      <button
                        onClick={() => setSelectedProjectId(project._id)}
                        className="hover:underline cursor-pointer text-[var(--accent-color)]"
                      >
                        {project.title}
                      </button>
                    </td>
                    <td className="px-4 py-2">{project.status || "N/A"}</td>
                    <td className="px-4 py-2">
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {project.inChargeName || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-left">
                      <div className="relative">
                        <button
                          className="cursor-pointer flex items-center justify-center"
                          onClick={(e) => toggleDropdown(project._id, e)}
                        >
                          <MoreHorizontal
                            size={18}
                            className="text-[var(--light-text)] hover:text-[var(--text-primary)] "
                          />
                        </button>
                        {/* Modal logic removed and moved to ProjectCards.tsx */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isDropdownOpen && dropdownPosition && (
              <div
                className="fixed z-[999] bg-[var(--bg)] shadow-lg rounded-md border border-[var(--border)]"
                style={{
                  top: dropdownPosition.top + 30, // Offset a bit from the button
                  left: dropdownPosition.left,
                }}
                ref={dropdownRef}
              >
                <ActionDropdown
                  onViewDetails={() => {
                    setSelectedProjectId(isDropdownOpen);
                    setIsDropdownOpen(null);
                  }}
                  onEditProject={() => {
                    const project = currentProjects.find(
                      (p) => p._id === isDropdownOpen
                    );
                    if (project) handleEdit(project);
                  }}
                  onAddTask={() => {
                    console.log("TODO: open Add Task modal");
                    setIsDropdownOpen(null);
                  }}
                  onDeleteProject={() => {
                    onDeleteProject(isDropdownOpen);
                    setIsDropdownOpen(null);
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile 2-Column Layout */}
          <div className="md:hidden  mt-4">
            {currentProjects.map((project) => (
              <div
                key={project._id}
                className="grid grid-cols-2 gap-4 border border-b-0 border-[var(--border)] p-4 bg-[var(--bg)] shadow-sm"
              >
                {/* Left col - Project Name */}
                <div className="flex items-center border-r border-[var(--border)]">
                  <button
                    onClick={() => setSelectedProjectId(project._id)}
                    className="font-medium text-[var(--accent-color)] cursor-pointer hover:underline"
                  >
                    {project.title}
                  </button>
                </div>
                {/* Right col - Other info */}
                <div className="space-y-1 text-sm text-[var(--light-text)]">
                  <p>
                    <span className="font-semibold">Status: </span>
                    {project.status || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Due: </span>
                    {project.dueDate
                      ? new Date(project.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">In Charge: </span>
                    {project.inChargeName || "N/A"}
                  </p>
                  <div className="relative">
                    <button onClick={() => toggleSmDropdown(project._id)}>
                      <MoreHorizontal
                        size={18}
                        className="text-[var(--light-text)] cursor-pointer mt-1"
                      />
                    </button>
                    {isSmScreenDropdownOpen == project._id && (
                      <div
                        className="absolute top-6 z-50 bg-[var(--bg)] left-0 shadow-lg rounded-md border border-[var(--border)]"
                        ref={smDropdownRef}
                      >
                        <ActionDropdown
                          onViewDetails={() => {
                            setSelectedProjectId(project._id);
                            setIsSmScreenDropdownOpen(null);
                          }}
                          onEditProject={() => handleEdit(project)}
                          onAddTask={() => {
                            console.log("TODO: open Add Task modal");
                            setIsSmScreenDropdownOpen(null);
                          }}
                          onDeleteProject={() => {
                            onDeleteProject(project._id);
                            setIsSmScreenDropdownOpen(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Project Details Modal (kept here for proximity to the button) */}
      <ProjectDetails
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />

      {/* Pagination (now uses props) */}
      <footer className="flex justify-between items-center mt-6 text-sm text-[var(--light-text)]">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-[var(--border)] cursor-pointer rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        {currentProjects.length > 0 && (
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-lg border border-[var(--border)] cursor-pointer ${
                  num === currentPage
                    ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                    : "hover:bg-[var(--hover-bg)]"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}

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

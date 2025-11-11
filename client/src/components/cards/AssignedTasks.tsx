import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddProjectModal from "../projects/AddProjectModal";

type Project = {
  _id: string;
  title: string;
  dueDate?: string;
  isTrashed?: boolean;
  userId?: string;
};

export default function AssignedTasks() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const handleProjectAdded = (newProject: Project) => {
    setProjects((prev) => {
      let updatedProjects;

      if (editProject) {
        // Edit logic
        updatedProjects = prev.map((p) =>
          p._id === newProject._id ? newProject : p
        );
      } else {
        // Add new project at top
        updatedProjects = [newProject, ...prev];
      }

      // Sort and limit to 3 most recent by dueDate
      return updatedProjects
        .sort(
          (a, b) =>
            new Date(b.dueDate || "").getTime() -
            new Date(a.dueDate || "").getTime()
        )
        .slice(0, 3);
    });

    setIsProjectModalOpen(false);
    setEditProject(null);
  };

  // --- END: Data and State moved from children ---

  const ProjectModal = () =>
    isProjectModalOpen && (
      <div className="fixed inset-0 bg-[var(--black-overlay)] flex items-center justify-center z-50">
        <div className="relative bg-[var(--bg)] p-6 rounded-xl shadow-lg w-[90%] max-w-md">
          <button
            onClick={() => {
              setIsProjectModalOpen(false);
              setEditProject(null);
            }}
            className="absolute -top-2  cursor-pointer -right-2 bg-[var(--accent-color)] rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] transition"
          >
            <X size={18} />
          </button>
          <AddProjectModal
            initialProject={editProject || undefined}
            onClose={() => {
              setIsProjectModalOpen(false);
              setEditProject(null);
            }}
            onProjectAdded={handleProjectAdded}
          />
        </div>
      </div>
    );
  const [projects, setProjects] = useState<Project[]>([]);
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3000/projects", {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });

        const filtered = res.data
          .filter((p: Project) => !p.isTrashed)
          .sort(
            (a: Project, b: Project) =>
              new Date(b.dueDate || "").getTime() -
              new Date(a.dueDate || "").getTime()
          )
          .slice(0, 3); // only 3 most recent

        setProjects(filtered);
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col border border-[var(--border)] bg-[var(--cards-bg)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[var(--border)]  px-4 py-1.5">
        <p className="text-lg font-medium text-[var(--text-primary)]">
          Projects
        </p>
        {}
        <div>
          <Link
            to={"/projects"}
            className="flex justify-center items-center p-1 rounded-md text-sm transition text-[var(--accent-color)] cursor-pointer hover:underline"
          >
            View More →
          </Link>
        </div>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 gap-2 p-3">
        {/* Add Project Button */}
        <button
          className="border border-[var(--accent-color)] flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--accent-color)] hover:bg-[var(--inside-card-bg)] transition cursor-pointer"
          onClick={() => setIsProjectModalOpen(true)}
        >
          <Plus size={16} />
          Add Project
        </button>
        {projects.map((item, index) => (
          <div
            key={index}
            className="border border-[var(--border)] flex items-center gap-4 px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--hover-bg)]  transition"
          >
            <div className="w-9 h-9 bg-[var(--accent-color)] rounded-full flex justify-center items-center font-semibold text-white">
              {item.title.slice(0, 2).toLocaleUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <h1 className="font-medium text-[var(--text-primary)]">
                {item.title}
              </h1>

              <p className="text-xs text-[var(--light-text)]">
                Due Date:{" "}
                {item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <ProjectModal />
    </div>
  );
}

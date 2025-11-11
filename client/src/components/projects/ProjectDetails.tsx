import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

type Project = {
  _id: string;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
  description: string;
};
type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status?: string;
};

type ProjectDrawerProps = {
  projectId: string | null;
  onClose: () => void;
};

export default function ProjectDetails({
  projectId,
  onClose,
}: ProjectDrawerProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<{ id: string; text: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "comments">("tasks");

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectAndTasks = async () => {
      try {
        setLoading(true);
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

        // fetch project
        const projectRes = await axios.get(
          `http://localhost:3000/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${authUser.token}` },
          }
        );
        setProject(projectRes.data);

        // fetch tasks of this project
        const tasksRes = await axios.get(
          `http://localhost:3000/tasks/${projectId}`,
          {
            headers: { Authorization: `Bearer ${authUser.token}` },
          }
        );
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch project or tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);
  useEffect(() => {
    if (projectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [projectId]);
  useEffect(() => {
    if (!projectId) return;

    // load comments for this project
    const storedComments = JSON.parse(
      localStorage.getItem(`comments_${projectId}`) || "[]"
    );
    setComments(storedComments);
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem(`comments_${projectId}`, JSON.stringify(comments));
    }
  }, [comments, projectId]);
  const addComment = (text: string) => {
    const newComment = { id: Date.now().toString(), text };
    setComments((prev) => [...prev, newComment]);
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  return (
    <>
      {/* Backdrop */}
      {projectId && (
        <div className="fixed inset-0 bg-black/10 z-50" onClick={onClose}></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[var(--bg)] shadow-xl border-l border-[var(--border)] z-50
  transform transition-transform duration-300 ease-in-out
  ${projectId ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex justify-between  p-4 pt-2 pb-2 relative">
          <button className="absolute text-white top-1 right-1 rounded-full bg-[var(--accent-color)] p-1.5 ">
            <X
              size={17}
              className=" rounded-full  cursor-pointer  "
              onClick={onClose}
            />
          </button>
        </header>
        <main className="flex flex-col p-4 gap-4 ">
          <p className="text-left text-xl text-[var(--primary-text)]">
            {loading ? "Loading..." : project?.title || "Project Details"}
          </p>
          <div className="flex gap-6">
            <p className="font-medium text-[var(--light-text)]">Due Date</p>
            <p>
              {project?.dueDate
                ? new Date(project.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div className="flex gap-10">
            <span className="font-medium text-[var(--light-text)]">Status</span>
            <span
              className={`px-2 py-0.5 rounded-full flex justify-center items-center text-xs ${
                project?.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : project?.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-violet-100 text-violet-700"
              }`}
            >
              {project?.status || "Unknown"}
            </span>
          </div>
          <div className="flex gap-10">
            <p className="font-medium text-[var(--light-text)]">Priority</p>
            <p>{project?.priority || "N/A"}</p>
          </div>
        </main>
        <div className="flex flex-col p-4 pt-2 pb-2 gap-2">
          <p className=" text-left text-base ">Description:</p>
          <p className="text-left text-[var(--light-text)]">
            {project?.description}
          </p>
        </div>
        <div>
          {/* tabs */}
          <div className="flex gap-2 border-b border-[var(--border)] p-4 pb-0">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === "tasks"
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--primary-text)]"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === "comments"
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--primary-text)]"
              }`}
            >
              Comments
            </button>
          </div>
          {/* Tab Content */}
          <div className="p-4 text-sm max-h-[300px] overflow-y-auto custom-scroll">
            {activeTab === "tasks" ? (
              tasks.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {tasks.map((task) => (
                    <li
                      key={task._id}
                      className="border border-[var(--border)] p-3 rounded-lg hover:bg-[var(--hover-bg)] transition"
                    >
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-[var(--light-text)]">
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-[var(--light-text)] mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--light-text)] italic">No tasks yet.</p>
              )
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 border border-[var(--border)] p-2 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        e.currentTarget.value.trim() !== ""
                      ) {
                        addComment(e.currentTarget.value.trim());
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>

                <ul className="flex flex-col gap-2">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="flex justify-between items-center border border-[var(--border)] p-2 rounded-md"
                      >
                        <span>{comment.text}</span>
                        <button
                          className="text-[var(--accent-color)] hover:opacity-75 cursor-pointer text-sm"
                          onClick={() => deleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="text-[var(--light-text)] italic">
                      No comments yet.
                    </p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

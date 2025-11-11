import { create } from "zustand";
import axios from "axios";

export interface Project {
  _id: string;
  title: string;
  description?: string;
  isTrashed?: boolean;
  priority?: "low" | "medium" | "high";
  inChargeName: string;
  role: string;
  status?: "To Do" | "In Progress" | "Completed";
  dueDate?: string;
  progress?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  // ✅ Fetch all projects from backend
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
       const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      const res = await axios.get("http://localhost:3000/projects", {
        headers: { Authorization: `Bearer ${authUser.token}` },
      });
      set({ projects: res.data });
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      set({ error: err.message || "Failed to fetch projects" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Add project (local + backend handled separately in modal)
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  // ✅ Delete project (local + backend)
  deleteProject: async (id) => {
    try {
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      await axios.delete(`http://localhost:3000/projects/${id}`, {
        headers: { Authorization: `Bearer ${authUser.token}` },
      });
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
      }));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  },

  // ✅ Update project (local + backend)
  updateProject: async (id, data) => {
    try {
       const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      const res = await axios.put(`http://localhost:3000/projects/${id}`, data, {
        headers: { Authorization: `Bearer ${authUser.token}` },
      });
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? res.data : p)),
      }));
    } catch (err) {
      console.error("Error updating project:", err);
    }
  },

  setProjects: (projects) => set({ projects }),
}));

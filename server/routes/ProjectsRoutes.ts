import { Router } from "express";
const router = Router();
import Projects from "../controllers/ProjectsControllers"
import { verifyToken } from "../middleware/authMiddleware";
import TasksModel from "../models/TasksModel";
import ProjectsModel from "../models/ProjectsModel";
router.use(verifyToken);
router.get("/",Projects.GetProjects );
router.get("/stats",Projects.GetProjectsStats );
router.get("/trashed",  Projects.GetTrashedProjects);
router.post("/", Projects.CreateProject);
router.get("/weekly-summary", async (req, res) => {
  try {
    const projects = await ProjectsModel.find();

    const completedProjects = projects.filter(
      (p) => p.status === "Completed"
    ).length;

    const targetProjects = projects.length; // or 10 if fixed target

    res.json({ completedProjects, targetProjects });
  } catch (error) {
    console.error("Error fetching weekly summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id",Projects.GetOneProject);
router.delete("/:id",Projects.DeleteProject);
router.put("/:id",Projects.UpdateProject);
router.put("/:id/trash", Projects.MoveToTrash);
router.put("/:id/restore", Projects.RestoreProject);


export default router;
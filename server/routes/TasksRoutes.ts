import { Router } from "express";
import TaskController from "../controllers/TaskController";
import { verifyToken } from "../middleware/authMiddleware";
import TasksModel from "../models/TasksModel";
const router = Router();



// GET all tasks
router.get("/", verifyToken, TaskController.GetAllTasks);
//Get stats
router.get("/stats", verifyToken, TaskController.GetTaskStats);
// monthly summary
router.get("/tasks-monthly-summary", verifyToken, TaskController.GetMonthlySummary);
// recent task 
router.get("/recent", verifyToken, TaskController.getRecentTasks);
// trashed tasks
router.get("/trashed", verifyToken, TaskController.GetTrashedTasks);
// 📅 GET: /tasks/monthly-summary
router.get("/monthly-summary", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await TasksModel.find({ userId });

    const monthlyData = Array(12).fill(0);
    tasks.forEach((task) => {
      if (task.status === "completed" && task.completedAt) {
        const monthIndex = new Date(task.completedAt).getMonth();
        monthlyData[monthIndex] += 1;
      }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = months.map((m, i) => ({ week: m, completed: monthlyData[i] }));

    res.json(formatted);
  } catch (error:any) {
    console.error("Error fetching monthly summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET tasks by project ID
router.get("/:projectId", verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // find all tasks where projectId matches
    const tasks = await TasksModel.find({ projectId }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching project tasks:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
});

// GET a single task by ID
router.get("/:id", verifyToken, TaskController.GetOneTask);

// CREATE a new task
router.post("/",verifyToken, TaskController.CreateTask);

// UPDATE an existing task by ID
router.put("/:id",verifyToken, TaskController.UpdateTask);

// PATCH update
router.patch("/:id",verifyToken, TaskController.UpdateAllTasks);

// DELETE a task by ID
router.delete("/:id",verifyToken, TaskController.DeleteTask);

// Trash operations
router.put("/:id/trash", verifyToken, TaskController.MoveTaskToTrash);
router.put("/:id/restore", verifyToken, TaskController.RestoreTask);
router.delete("/:id/permanent", verifyToken, TaskController.PermanentlyDeleteTask);


export default router;

import { Request, Response } from "express";

import TasksModel from "../models/TasksModel";
import ProjectsModel from "../models/ProjectsModel";
import { createNotification } from "./NotificationsController";
console.log("✅ TasksRoutes loaded");
export const GetMonthlySummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const summary = await TasksModel.aggregate([
      // 1️⃣ Filter: only completed tasks of this user
      {
        $match: {
          userId,
          status: "completed",
          isTrashed: false,
           completedAt: { $ne: null },
        },
      },
      // 2️⃣ Group by month and year
      {
        $group: {
  _id: {
    year: { $year: "$completedAt" },
    month: { $month: "$completedAt" },
  },
  completed: { $sum: 1 },
},

      },
      // 3️⃣ Sort chronologically
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      // 4️⃣ Format the response
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "", // months start at 1
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id.month",
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          completed: 1,
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error: any) {
    console.error("❌ Error fetching monthly summary:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const GetTaskStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

     const [totalCount, completedCount, inProgressCount, toDoCount, dueTodayCount] = await Promise.all([
      TasksModel.countDocuments({ userId, isTrashed: false }),
      TasksModel.countDocuments({ userId, status: "completed", isTrashed: false }),
      TasksModel.countDocuments({ userId, status: "in progress", isTrashed: false }),
      TasksModel.countDocuments({ userId, status: "to do", isTrashed: false }),
      TasksModel.countDocuments({
        userId,
        isTrashed: false,
        dueDate: { $gte: startOfDay, $lt: endOfDay },
      }),
    ]);
    res.status(200).json({
      totalCount,
      completedCount,
      inProgressCount,
      pendingCount: toDoCount, // Renamed for UI clarity
      dueTodayCount,
    });
  } catch (error: any) {
    console.error("❌ Error fetching task stats:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const GetAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // ✅ from token
    const tasks = await TasksModel.find({ userId });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const CreateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // from verifyToken
    const { title, description, status, priority, dueDate, projectId } = req.body;
    if (req.body.status?.toLowerCase() === "completed") {
  req.body.completedAt = new Date();
}

    // ensure project exists & belongs to same user
    const project = await ProjectsModel.findOne({ _id: projectId, userId });
    if (!project) return res.status(404).json({ message: "Project not found or unauthorized" });

    const newTask = await TasksModel.create({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      userId,
    });

    // Create notification for task creation
    await createNotification(
      userId,
      'task_created',
      'New Task Created',
      `Task "${newTask.title}" has been created in project "${project.title}".`,
      newTask._id.toString()
    );

    const io = req.app.get("io");
    io.emit("task_created", newTask);
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


const GetOneTask = async (req: Request, res: Response) => {
  try {
    const task = await TasksModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const UpdateTask = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

// Example inside UpdateTask
if (req.body.status && req.body.status.toLowerCase() === "completed") {
  req.body.completedAt = new Date();
} else if (req.body.status && req.body.status.toLowerCase() !== "completed") {
  req.body.completedAt = null; // optional: clear date if task marked incomplete
}

    const task = await TasksModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Create notification for task update
    await createNotification(
      task.userId.toString(),
      'task_updated',
      'Task Updated',
      `Task "${task.title}" has been updated.`,
      task._id.toString()
    );

    const io = req.app.get("io");
    io.emit("task_updated", task);
    res.status(200).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
// move to trash
export const MoveToTrash = async (req: Request, res: Response) => {
  try {
    const task = await TasksModel.findByIdAndUpdate(
      req.params.id,
      { isTrashed: true, deletedOn: new Date() }, 
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
const DeleteTask = async (req: Request, res: Response) => {
  try {
    const task = await TasksModel.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Create notification for task deletion
    await createNotification(
      task.userId.toString(),
      'task_deleted',
      'Task Deleted',
      `Task "${task.title}" has been deleted.`,
      task._id.toString()
    );

    const io = req.app.get("io");
    io.emit("task_deleted", req.params.id);
    res.status(200).json({ message: "Task deleted successfully", task });
    
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all trashed tasks
const GetTrashedTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const trashedTasks = await TasksModel.find({ userId, isTrashed: true });
    
    if (!trashedTasks || trashedTasks.length === 0) {
      return res.status(404).json({ message: "No trashed tasks found" });
    }
    
    res.status(200).json(trashedTasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Move task to trash
export const MoveTaskToTrash = async (req:Request, res:Response) => {
  const userId = (req as any).user.id;
  try {
    console.log("🔥 Task ID:", req.params.id);
    console.log("🧠 User:", userId);
    console.log("🟢 MoveTaskToTrash route reached");


    const task = await TasksModel.findByIdAndUpdate(
      req.params.id,
      {
        isTrashed: true,
        deletedOn: new Date(),
        originalStatus: req.body.status || "to do",
      },
      { new: true }
    );

    if (!task) {
      console.log("⚠️ Task not found in DB");
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("✅ Task moved to trash:", task);
    res.status(200).json(task);
  } catch (error:any) {
    console.error("❌ MoveTaskToTrash error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Restore task from trash
const RestoreTask = async (req: Request, res: Response) => {
  try {
    const task = await TasksModel.findByIdAndUpdate(
      req.params.id,
      { 
        isTrashed: false, 
        deletedOn: null,
        status: req.body.originalStatus || "to do"
      },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Permanently delete task
const PermanentlyDeleteTask = async (req: Request, res: Response) => {
  try {
    const task = await TasksModel.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task permanently deleted", task });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
const UpdateAllTasks = async (req:Request, res: Response)=>{
  try {
    if (req.body.status && req.body.status.toLowerCase() === "completed") {
    req.body.completedAt = new Date();
} else {
    req.body.completedAt = null;
}

    const updatedTask = await TasksModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
};

export const getRecentTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
const limit = parseInt(req.query.limit as string) || 4;
const recentTasks = await TasksModel.find({ userId })
  .sort({ createdAt: -1 })
  .limit(limit);


    res.status(200).json(recentTasks);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch recent tasks", error: error.message });
  }
};

export default { 
  GetAllTasks, 
  CreateTask, 
  GetOneTask, 
  UpdateTask, 
  DeleteTask, 
  UpdateAllTasks, 
  getRecentTasks, 
  GetTaskStats,
  GetTrashedTasks,
  MoveTaskToTrash,
  RestoreTask,
  PermanentlyDeleteTask,
  GetMonthlySummary
};

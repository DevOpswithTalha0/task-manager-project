import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRouter from "./routes/AuthRouter";
import ProjectsRoutes from "./routes/ProjectsRoutes";
import TasksRoutes from "./routes/TasksRoutes";
import UserRoutes from "./routes/UserRouter";
import ProfileRoutes from "./routes/ProfileRoutes";
import AccountRoutes from "./routes/AccountRoutes";
import NotificationsRoutes from "./routes/NotificationsRoutes";
import TrashRoutes from "./routes/TrashRoutes";
import AssignedTasksRoutes from "./routes/AssignedTasks";
import notificationSettingsRoutes from "./routes/notificationSettingsRoutes";

// DB connection
import "./models/db";
import TasksModel from "./models/TasksModel";
import ProjectsModel from "./models/ProjectsModel"; // Ensure you have ProjectsModel if needed
import { createNotification } from "./controllers/NotificationsController";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create the HTTP server and attach socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"], 
  },
});
app.set("io", io); // Store io instance in app

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  
  // Join user to their personal room for notifications
  socket.on("join-user-room", (userId: string) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });
  
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Helper function to broadcast notifications via Socket.IO
export const broadcastNotification = (userId: string, notification: any) => {
  const io = app.get("io");
  if (io) {
    io.to(`user-${userId}`).emit("new-notification", notification);
  }
};

// Cron job that checks for due tasks
cron.schedule("*/30 * * * *", async () => {
  const now = new Date();
  const soon = new Date(now.getTime() + 60 * 60 * 1000); // tasks due within the next hour

  try {
    const dueTasks = await TasksModel.find({ 
      dueDate: { $lte: soon, $gte: now },
      status: { $ne: "completed" }
    });

    if (dueTasks.length > 0) {
      const io = app.get("io"); // Get the io instance

      if (io) {
        io.emit("task_due_soon", dueTasks); // Emit the event if io is available
      }

      // Create notifications for each due task
      for (const task of dueTasks) {
    await createNotification(
        // FIX: Convert task.userId (ObjectId) to a string
        task.userId.toString(), 
        'task_due_soon',
        'Task Due Soon',
        `Task "${task.title}" is due soon (${task.dueDate?.toLocaleString()}).`,
        task._id.toString()
    );
}
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// Use routes
app.use("/auth", AuthRouter);
app.use("/projects", ProjectsRoutes);
app.use("/tasks", TasksRoutes);
app.use("/assigned", AssignedTasksRoutes);
app.use("/user", UserRoutes);
app.use("/profile", ProfileRoutes);
app.use("/account", AccountRoutes);
app.use("/notifications", NotificationsRoutes);
app.use("/trash", TrashRoutes);
app.use("/api/notifications/preferences", notificationSettingsRoutes);
// Default home route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome! 🚀 Your server is running.");
});

// Ping route for health check
app.get("/ping", (req: Request, res: Response) => {
  res.send("PONG");
});

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


import mongoose from "mongoose";

const TasksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    completedAt: { type: Date },
     projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["to do", "in progress", "completed"],
      lowercase: true,
      trim: true,
      default: "to do",
       set: (val: string) => val.replace("inprogress", "in progress"),
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"], 
      lowercase: true, 
      trim: true, 
      default: "medium", 
    },

    dueDate: {
      type: Date,
    },
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   isTrashed: { type: Boolean, default: false },
   deletedOn: { type: Date },
   originalStatus: { type: String }, // Store original status before trashing
  },
  { timestamps: true }
);
const TasksModel = mongoose.model("Task", TasksSchema);
export default TasksModel;

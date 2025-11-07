export type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: number;
  priority?: string;
  isTrashed?: boolean;
  status: "to do" | "in progress" | "completed";
};

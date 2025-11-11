import { useEffect, useState } from "react";
import axios from "axios";

type TaskStats = {
  totalCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  dueTodayCount: number;
  isTrashed: boolean;
};
export default function TasksOverview() {
  const [stats, setStats] = useState<TaskStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

        const res = await axios.get("http://localhost:3000/tasks/stats", {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        });
        const data = res.data;

        // Only set stats if not trashed
        if (!data.isTrashed) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch task stats", error);
      }
    };

    fetchStats();
  }, []);

  const collection = stats
    ? [
        { name: "Total tasks", count: stats.totalCount },
        { name: "Pending tasks", count: stats.pendingCount },
        { name: "Completed tasks", count: stats.completedCount },
        { name: "In Progress", count: stats.inProgressCount },
        { name: "Due today", count: stats.dueTodayCount },
      ]
    : [];

  return (
    <div className="p-4 pt-4 pb-3 dark:bg-gray-900 rounded-xl">
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
      >
        {collection.map((item, index) => (
          <div
            key={index}
            className="p-1.5 flex flex-col items-center justify-center border rounded-xl  border-[var(--border)] bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] "
          >
            <p className="text-sm font-medium  text-[var(--light-text)] text-center">
              {item.name}
            </p>
            <p className="text-xl font-bold  dark:text-white mt-2">
              {item.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

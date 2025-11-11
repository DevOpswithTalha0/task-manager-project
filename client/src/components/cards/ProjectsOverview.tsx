import axios from "axios";
import { useEffect, useState } from "react";
type ProjectStats = {
  totalCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  dueTodayCount: number;
};
export default function ProjectsOverview() {
  const [stats, setStats] = useState<ProjectStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

        const res = await axios.get("http://localhost:3000/projects/stats", {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch task stats", error);
      }
    };

    fetchStats();
  }, []);
  const collection = [
    { name: "Total Projects", count: stats?.totalCount },
    { name: "Pending Projects", count: stats?.pendingCount },
    { name: "Completed Projects", count: stats?.completedCount },
    { name: "In Progress", count: stats?.inProgressCount },
    { name: "Due today", count: stats?.dueTodayCount },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 pt-4 pb-3  rounded-xl">
      {collection.map((item, index) => (
        <div
          key={index}
          className="p-1.5 flex flex-col items-center justify-center border rounded-xl bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] border-[var(--border)] "
        >
          <p className="text-sm font-medium text-[var(--light-text)] text-center">
            {item.name}
          </p>
          <p className="text-xl font-bold  mt-2">{item.count}</p>
        </div>
      ))}
    </div>
  );
}

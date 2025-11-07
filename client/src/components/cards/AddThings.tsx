import React, { useEffect, useState } from "react";
import {
  PlusSquare,
  ClipboardList,
  FolderKanban,
  CheckSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AddThings() {
  const [projectStats, setProjectStats] = useState<{ totalCount: number }>({
    totalCount: 0,
  });
  const [taskStats, setTaskStats] = useState<{ totalCount: number }>({
    totalCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

        const [projectsRes, tasksRes] = await Promise.all([
          axios.get("http://localhost:3000/projects/stats", {
            headers: { Authorization: `Bearer ${authUser.token}` },
          }),
          axios.get("http://localhost:3000/tasks/stats", {
            headers: { Authorization: `Bearer ${authUser.token}` },
          }),
        ]);

        setProjectStats(projectsRes.data);
        setTaskStats(tasksRes.data);
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const actions = [
    {
      name: "Create Task",
      detail: "Add tasks to your projects",
      icon: <ClipboardList className="h-6 w-6 text-[var(--accent-color)]" />,
      path: "/tasks",
    },
    {
      name: "Add Project",
      detail: "Start a new project",
      icon: <PlusSquare className="h-6 w-6 text-[var(--accent-color)]" />,
      path: "/projects",
    },
  ];

  const stats = [
    {
      name: "Total Projects",
      count: projectStats.totalCount,
      icon: <FolderKanban className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Total Tasks",
      count: taskStats.totalCount,
      icon: <CheckSquare className="h-5 w-5 text-green-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl">
      {/* Quick Actions */}
      {actions.map((item, index) => (
        <Link
          to={item.path}
          key={index}
          className="p-2 flex items-center gap-4 border border-[var(--border)] rounded-xl bg-[var(--cards-bg)] cursor-pointer"
        >
          <div className="p-2 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <p className="text-base font-medium ">{item.name}</p>
            <p className="text-sm text-[var(--light-text)]">{item.detail}</p>
          </div>
        </Link>
      ))}

      {/* Stats */}
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-2 flex items-center gap-4 border border-[var(--border)] rounded-xl bg-[var(--cards-bg)]"
        >
          <div className="p-2.5 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
            {stat.icon}
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-sm">{stat.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

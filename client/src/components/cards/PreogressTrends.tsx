import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import axios from "axios";

export default function ProgressTrends() {
  const data = [
    { week: "Jan", completed: 30 },
    { week: "Feb", completed: 45 },
    { week: "Mar", completed: 60 },
    { week: "Apr", completed: 50 },
    { week: "May", completed: 70 },
    { week: "Jun", completed: 90 },
  ];
  const [tasksCompletedData, setTasksCompletedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        const authUser = localStorage.getItem("authUser");
        const token = authUser ? JSON.parse(authUser).token : "";

        const res = await axios.get(
          "http://localhost:3000/tasks/monthly-summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const lastSix = res.data.slice(-6); // last 6 months
        setTasksCompletedData(lastSix);
      } catch (error) {
        console.error("Error fetching monthly summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySummary();
  }, []);

  const hasCompletedTasks =
    tasksCompletedData.length > 0 &&
    tasksCompletedData.some((t) => t.completed > 0);

  return (
    <div className="bg-[var(--cards-bg)] border rounded-xl border-[var(--border)]">
      <div className="p-3 pt-1.5 pb-1.5 border-b border-[var(--border)]">
        <p className="text-lg font-medium">Tasks Completed Per Month</p>
      </div>

      <div className="p-3 pb-1 h-[250px] flex items-center justify-center">
        {loading ? (
          <p className="text-[var(--light-text)]">Loading...</p>
        ) : hasCompletedTasks ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tasksCompletedData}
              barCategoryGap="15%"
              margin={{ top: 10, right: 10, left: -22, bottom: 10 }}
              className="pl-0"
            >
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--light-text)", fontSize: 14 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--light-text)", fontSize: 14 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "var(--accent-hover)", opacity: 0.2 }}
                contentStyle={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--primary-text)",
                }}
                itemStyle={{ color: "var(--primary-text)" }}
              />
              <Bar
                dataKey="completed"
                radius={[4, 4, 0, 0]}
                fill="var(--accent-color)"
              >
                {/* Add gradient fill for top color */}
                <LabelList
                  dataKey="completed"
                  position="top"
                  fill="var(--accent-color)"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[var(--light-text)] text-center">
            No tasks completed yet
          </p>
        )}
      </div>
    </div>
  );
}

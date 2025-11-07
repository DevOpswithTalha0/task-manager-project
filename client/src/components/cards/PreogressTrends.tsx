import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

export default function ProgressTrends() {
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

        const lastSix = res.data.slice(-6);
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
    <div className="bg-[var(--cards-bg)]  border rounded-xl border-[var(--border)]">
      <div className="p-3 pt-1.5 pb-1.5 border-b border-[var(--border)] ">
        <p className="text-lg font-medium ">Tasks Completed Per Month</p>
      </div>

      <div className="p-3 pb-1 h-[250px] flex items-center justify-center">
        {loading ? (
          <p className="text-[var(--light-text)]">Loading...</p>
        ) : hasCompletedTasks ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tasksCompletedData} barCategoryGap="10%">
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--light-text)", fontSize: 14 }}
              />
              <YAxis hide domain={[0, "auto"]} />{" "}
              {/* ← Add domain to start at 0 */}
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
                fill="var(--accent-color)"
                radius={[4, 4, 0, 0]}
              />
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

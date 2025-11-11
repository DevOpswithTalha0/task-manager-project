import { useEffect, useState } from "react";
import axios from "axios";
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from "recharts";
import { toast } from "react-toastify";

export default function WeeklyProjectsChart() {
  const [summary, setSummary] = useState({
    completedProjects: 0,
    targetProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      try {
        const res = await axios.get(
          "http://localhost:3000/projects/weekly-summary",
          {
            headers: { Authorization: `Bearer ${authUser.token}` },
          }
        );
        setSummary(res.data);
      } catch (error: any) {
        toast.error("Error fetching weekly summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const { completedProjects, targetProjects } = summary;
  const remaining = Math.max(targetProjects - completedProjects, 0);
  const noProjects = completedProjects === 0 && targetProjects === 0;

  const data = [
    {
      name: "Completed",
      value: completedProjects,
      fill: "var(--accent-color)",
    },
    { name: "Remaining", value: remaining, fill: "var(--weekly-circle)" },
  ];

  return (
    <div className="flex flex-col bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
      {/* Always show title */}
      <div>
        <p className="text-lg font-medium text-left px-2 py-1.5 text-[var(--text-primary)] border-b border-[var(--border)]">
          Weekly Projects Summary
        </p>
      </div>

      <div className="flex justify-center items-center p-2 h-[210px]">
        {loading ? (
          <p className="text-[var(--light-text)]">Loading weekly summary...</p>
        ) : noProjects ? (
          <p className="text-[var(--light-text)] text-center">
            No projects added yet
          </p>
        ) : (
          <RadialBarChart
            width={250}
            height={190}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, targetProjects || 10]}
              tick={false}
            />
            <RadialBar
              cornerRadius={10}
              background={{ fill: "var(--inside-card-bg)" }}
              dataKey="value"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--primary-text)",
                borderRadius: "8px",
                padding: "8px",
              }}
              itemStyle={{ color: "var(--primary-text)" }}
            />
          </RadialBarChart>
        )}
      </div>

      {!noProjects && (
        <p className="mt-2 mb-3 text-sm text-[var(--light-text)] text-center">
          <span className="font-semibold text-[var(--accent-color)]">
            {completedProjects}
          </span>{" "}
          / {targetProjects} projects
        </p>
      )}
    </div>
  );
}

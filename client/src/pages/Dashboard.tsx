import { useState } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";
import ProgressTrends from "../components/cards/PreogressTrends";
import AssignedTasks from "../components/cards/AssignedTasks";
import Notepad from "../components/cards/Notepad";
import AddThings from "../components/cards/AddThings";
import WeeklyProjectsChart from "../components/cards/WeeklyProjectsChart";
import TasksCreatedToday from "../components/cards/TasksCreatedToday";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <DashboardHeader
          title="Dashboard"
          subtitle="Monitor all of your projects and tasks here"
          showSearch={false}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="p-4 space-y-4">
          {/* Add Things Card */}
          <AddThings />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProgressTrends />
            <WeeklyProjectsChart />
            <AssignedTasks />
          </div>

          {/* Chart + Notepad Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TasksCreatedToday />
            </div>
            <div className="lg:col-span-1">
              <Notepad />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

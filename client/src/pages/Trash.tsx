import DashboardHeader from "../components/layout/DashboardHeader";
import TrashSection from "../components/sections/TrashSection";

export default function Trash() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <DashboardHeader
        title="Trash"
        subtitle="View, restore, or permanently delete items."
        showSearch={false}
      />
      <div className="p-4">
        <TrashSection />
      </div>
    </div>
  );
}

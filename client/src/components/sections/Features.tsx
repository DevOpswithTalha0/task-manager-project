import React from "react";
import {
  ClipboardList,
  BarChart3,
  Target,
  LayoutDashboard,
  Palette,
  CalendarDays,
} from "lucide-react";

type Feature = {
  icon: React.ElementType;
  title: string;
  desc: string;
};

export default function Features() {
  const featuresTop: Feature[] = [
    {
      icon: LayoutDashboard,
      title: "All-in-One Dashboard",
      desc: "Track your projects, deadlines, and progress all in one clean, unified workspace.",
    },
    {
      icon: ClipboardList,
      title: "Smart Task Management",
      desc: "Organize, prioritize, and focus on what truly matters with intuitive task controls.",
    },
    {
      icon: Target,
      title: "Goal & Habit Tracker",
      desc: "Set personal goals, build habits, and stay accountable with progress milestones.",
    },
  ];

  const featuresBottom: Feature[] = [
    {
      icon: CalendarDays,
      title: "Reminders & Scheduling",
      desc: "Stay on top of your day with smart reminders, recurring tasks, and calendar integration.",
    },
    {
      icon: BarChart3,
      title: "Progress Insights",
      desc: "Visualize your achievements with charts and analytics that keep you motivated.",
    },
    {
      icon: Palette,
      title: "Customizable Workspace",
      desc: "Switch between light or dark themes and personalize your setup for better focus.",
    },
  ];

  const renderCard = (feature: Feature, index: number) => {
    const Icon = feature.icon;
    return (
      <div
        key={index}
        className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden border border-[var(--border)]"
      >
        {/* Curved shape with icon inside */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-violet-50 rounded-br-3xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-violet-500" />
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.desc}</p>
        </div>
      </div>
    );
  };

  return (
    <section
      id="features"
      className="mt-10 mb-10 py-10 px-6 rounded-3xl w-[85%] mx-auto"
    >
      <div className="text-center mb-14 flex flex-col items-center gap-2">
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-500 rounded-full text-sm font-medium">
          Features
        </p>
        <p className="text-5xl font-medium text-black leading-tight">
          Everything You Need to Manage
        </p>
        <p className="text-5xl font-medium text-black mb-4">
          Your Projects & Tasks
        </p>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-lg">
          From daily to-dos to major projects. PlanOra helps you organize,
          track, and achieve more with clarity and focus.
        </p>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {featuresTop.map(renderCard)}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuresBottom.map(renderCard)}
      </div>
    </section>
  );
}

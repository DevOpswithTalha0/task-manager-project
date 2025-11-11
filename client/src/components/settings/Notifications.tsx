import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Notifications() {
  const [settings, setSettings] = useState({
    taskReminders: true,
    dueDateAlerts: false,
    emailUpdates: true,
  });
  const [loading, setLoading] = useState(false);
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const BASE_URL = "http://localhost:3000/api/notifications/preferences";

  // ✅ Fetch user settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch(BASE_URL, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data);
      } catch (err: any) {
        toast.error(err.message || "Error loading settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Save changes
  const handleSave = async () => {
    try {
      const res = await fetch(BASE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      toast.success("Settings updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Error updating settings");
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-8">
      <div>
        <p className="text-xl font-semibold ">Notifications</p>
        <p className="text-sm text-[var(--light-text)]">
          Manage your notification preferences.
        </p>
      </div>

      {/* Toggles */}
      {["taskReminders", "dueDateAlerts", "emailUpdates"].map((key) => (
        <div
          key={key}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <p className="text-base font-medium ">
              {key === "taskReminders"
                ? "Task Reminders"
                : key === "dueDateAlerts"
                ? "Due Date Alerts"
                : "Email Updates"}
            </p>
            <p className="text-sm text-[var(--light-text)]">
              {key === "taskReminders"
                ? "Get reminders when tasks are due soon."
                : key === "dueDateAlerts"
                ? "Receive alerts for approaching or missed due dates."
                : "Stay informed about updates and activity summaries."}
            </p>
          </div>

          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                [key]: !prev[key as keyof typeof prev],
              }))
            }
            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
              settings[key as keyof typeof settings]
                ? "bg-[var(--accent-color)]"
                : "bg-[var(--light-text)]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[var(--bg)] rounded-full shadow-md transform transition-transform ${
                settings[key as keyof typeof settings]
                  ? "translate-x-6"
                  : "translate-x-0"
              }`}
            ></span>
          </button>
        </div>
      ))}

      {/* Buttons */}
      <div className="pt-2 flex justify-end gap-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] px-6 py-2.5 rounded-lg font-medium cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
          className="w-full sm:w-auto text-white px-6 py-2 rounded-lg font-medium cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

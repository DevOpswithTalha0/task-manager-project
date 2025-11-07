import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
export default function Appearance() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  // keep track of temporary selection (before Save)
  const [tempAccent, setTempAccent] = useState(accentColor);
  const [initialAccent, setInitialAccent] = useState(accentColor);

  useEffect(() => {
    // whenever accentColor from context changes, sync it
    setTempAccent(accentColor);
    setInitialAccent(accentColor);
  }, [accentColor]);

  const colors = [
    { name: "Violet", color: "bg-violet-700" },
    { name: "Pink", color: "bg-pink-700" },
    { name: "Blue", color: "bg-blue-700" },
    { name: "Green", color: "bg-green-700" },
  ];

  // handle color preview selection
  const handleColorSelect = (color: string) => {
    setTempAccent(color);
    document.documentElement.style.setProperty(
      "--accent-color",
      `var(--accent-${color}-500)`
    );
    document.documentElement.style.setProperty(
      "--accent-bg-color",
      `var(--accent-${color}-100)`
    );
    document.documentElement.style.setProperty(
      "--accent-hover-color",
      `var(--accent-${color}-hover)`
    );
    document.documentElement.style.setProperty(
      "--accent-highlight-color",
      `var(--accent-${color}-600)`
    );
    document.documentElement.style.setProperty(
      "--accent-btn-hover-color",
      `var(--accent-btn-${color}-700)`
    );
  };

  const handleCancel = () => {
    setTempAccent(initialAccent);
    document.documentElement.style.setProperty(
      "--accent-color",
      `var(--accent-${initialAccent}-500)`
    );
    document.documentElement.style.setProperty(
      "--accent-bg-color",
      `var(--accent-${initialAccent}-100)`
    );
    document.documentElement.style.setProperty(
      "--accent-hover-color",
      `var(--accent-${initialAccent}-hover)`
    );
    document.documentElement.style.setProperty(
      "--accent-highlight-color",
      `var(--accent-${initialAccent}-600)`
    );
    document.documentElement.style.setProperty(
      "--accent-btn-hover-color",
      `var(--accent-btn-${initialAccent}-700)`
    );
  };

  // save → apply & persist via context
  const handleSave = () => {
    setAccentColor(tempAccent);
    setInitialAccent(tempAccent);
    toast.success("Appearance settings updated successfully!");
  };

  return (
    <div
      className="m-4 border border-[var(--border)] rounded-2xl p-6 space-y-8"
      style={{ backgroundColor: "var(--cards-bg)" }}
    >
      {/* Title */}
      <div>
        <p className="text-xl font-semibold">Appearance</p>
        <p className="text-sm text-[var(--light-text)]">
          Customize how your dashboard looks and feels.
        </p>
      </div>

      {/* Accent Color Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-16 lg:justify-start">
        <div>
          <p className="text-lg font-medium text-[var(--text-primary)]">
            Accent Color
          </p>
          <p className="text-sm text-[var(--light-text)]">
            Choose your favorite color for highlights and buttons.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {colors.map((c) => {
            const isSelected = tempAccent === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => handleColorSelect(c.name.toLowerCase())}
                className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 transition cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]"
                    : "border-[var(--border)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${c.color}`}></span>
                <span className="text-sm">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Preference */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-16 lg:justify-start">
        <div>
          <p className="text-lg font-medium text-[var(--text-primary)]">
            Theme Preference
          </p>
          <p className="text-sm text-[var(--light-text)]">
            Choose between light and dark mode for your dashboard.
          </p>
        </div>

        <div className="flex gap-4">
          <div
            className="flex flex-col items-center border-2 cursor-pointer border-[var(--border)] rounded-xl p-4 w-32 hover:border-[var(--accent-color)] transition"
            onClick={() => setTheme("light")}
          >
            <button
              className={`w-full h-16 bg-gray-500 rounded-md mb-2 ${
                theme === "light" ? "ring-2 ring-[var(--accent-color)]" : ""
              }`}
            ></button>
            <span className="text-sm">Light</span>
          </div>
          <div
            className="flex flex-col items-center border-2 cursor-pointer border-[var(--border)] rounded-xl p-4 w-32 hover:border-[var(--accent-color)] transition"
            onClick={() => setTheme("dark")}
          >
            <button
              className={`w-full h-16 bg-gray-500 rounded-md mb-2 ${
                theme === "dark" ? "ring-2 ring-[var(--accent-color)]" : ""
              }`}
            ></button>
            <span className="text-sm">Dark</span>
          </div>
        </div>
      </div>

      {/* Save & Cancel Buttons */}
      <div className="pt-2 flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer px-6 py-2.5 rounded-lg font-medium transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto text-white px-6 py-2 rounded-lg cursor-pointer font-medium transition bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color!)] "
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

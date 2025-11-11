import React, { useEffect } from "react";
import { User, Settings, LogOut, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function Dropdown() {
  const [data, setData] = React.useState<string>("User");
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  useEffect(() => {
    const fetchName = async () => {
      const nameParts = await axios.get(
        "http://localhost:3000/projects/stats",
        {
          headers: { Authorization: `Bearer ${authUser.token}` },
        }
      );
      setData(nameParts.data.name || "User");
    };

    fetchName();
  }, []);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const items = [
    {
      name: "My Profile",
      icon: User,
      onClick: () => navigate("/settings?tab=Profile"),
    },
    {
      name: "Manage Account",
      icon: User,
      onClick: () => navigate("/settings?tab=Account"),
    },
    {
      name: "Settings",
      icon: Settings,
      onClick: () => navigate("/settings?tab=Profile"),
    },
    {
      name: "Theme",
      icon: Palette,
      onClick: () => navigate("/settings?tab=Appearance"),
    },
  ];

  return (
    <div className="w-64 z-[60] bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
        <span className="bg-[var(--accent-color)] w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
          {authUser.name ? authUser.name.charAt(0).toUpperCase() : "U"}
        </span>
        <div className="flex flex-col">
          <p className="font-medium ">{authUser.name}</p>
          <p className="text-[var(--light-text)] text-sm truncate">
            {authUser.email}
          </p>
        </div>
      </header>

      {/* Menu Items */}
      <main className="p-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg  hover:bg-[var(--hover-bg)]    cursor-pointer"
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </button>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] p-2">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-red-600 hover:bg-[var(--hover-bg)]  focus:bg-red-50 focus:outline-none cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </footer>
    </div>
  );
}

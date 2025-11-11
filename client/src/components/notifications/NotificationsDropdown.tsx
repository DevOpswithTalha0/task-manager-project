import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import {
  Bell,
  Check,
  Trash2,
  Folder,
  ListTodo,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Notification {
  _id: string;
  type:
    | "project_created"
    | "project_updated"
    | "project_deleted"
    | "task_created"
    | "task_updated"
    | "task_deleted"
    | "task_due_soon";
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "project_created":
    case "project_updated":
    case "project_deleted":
      return <Folder className="h-4 w-4 text-blue-500" />;
    case "task_created":
    case "task_updated":
    case "task_deleted":
      return <ListTodo className="h-4 w-4 text-green-500" />;
    case "task_due_soon":
      return <Clock className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};
type NotificationProps = { collapsed?: boolean; onClose?: () => void };
const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "project_created":
    case "task_created":
      return "bg-[var(--cards-bg)] border-[var(--border)]";
    case "project_updated":
    case "task_updated":
      return "bg-[var(--cards-bg)] border-[var(--border)]";
    case "project_deleted":
    case "task_deleted":
      return "bg-[var(--cards-bg)] border-[var(--border)]";
    case "task_due_soon":
      return "bg-[var(--cards-bg)] border-[var(--border)]";
    default:
      return "bg-[var(--cards-bg)] border-[var(--border)]";
  }
};

export default function NotificationsDropdown({
  collapsed,
  onClose,
}: NotificationProps) {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose?.(); // Close if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!authUser || !authUser.token) {
      console.error("User not found or missing token. Please log in.");
      return;
    }

    const newSocket = io("http://localhost:3000", {
      auth: {
        token: authUser.token,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to notification server");
      // Join user's personal room
      newSocket.emit("join-user-room", authUser.id);
    });

    newSocket.on("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.title);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from notification server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authUser?.token, authUser?.id]);

  // Fetch notifications on mount
  useEffect(() => {
    if (!authUser?.token) return;
    fetchNotifications();
  }, [authUser?.token]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:3000/notifications", {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to mark as read");

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("http://localhost:3000/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to mark all as read");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err.message || "Failed to mark all as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete notification");

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      ref={dropdownRef}
      className={`fixed  top-6 bottom-6 h-auto w-80 bg-[var(--bg)]  border border-[var(--border)]  shadow-xl rounded-xl z-50 overflow-hidden ${
        collapsed ? "left-24" : "left-68"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--accent-color)]  border-b border-[var(--border)] ">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-white " />
          <p className="font-semibold text-lg text-white ">Notifications</p>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="p-1.5 rounded-md hover:bg-[var(--accent-btn-hover-color)]  cursor-pointer hover:text-white transition"
              title="Mark all as read"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 max-h-116 ">
        {isLoading ? (
          <div className="text-center py-4 text-[var(--light-text)] ">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-[var(--light-text)] ">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-3 rounded-md border cursor-pointer transition ${
                notification.isRead
                  ? "bg-[var(--cards-bg)]  hover:bg-[var(--hover-bg)] "
                  : "bg-[var(--bg)]  hover:bg-[var(--hover-bg)] "
              } ${getNotificationColor(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          notification.isRead
                            ? "text-[var(--light-text)] "
                            : "text-[var(--text-primary)] "
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-[var(--text-primary)]  mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[var(--light-text)] mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1 rounded hover:bg-[var(--hover-bg)]  transition cursor-pointer"
                          title="Mark as read"
                        >
                          <Check
                            size={14}
                            className="text-[var(--light-text)]"
                          />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] bg-[var(--bg)]  px-4 py-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-[var(--light-text)]">
            {notifications.length} total notifications
          </p>
          <button
            onClick={fetchNotifications}
            className="text-xs text-[var(--accent-color)]  hover:underline font-medium cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

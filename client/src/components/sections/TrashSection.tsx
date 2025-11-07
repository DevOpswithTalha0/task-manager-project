import { useState, useEffect, useRef } from "react";
import { RotateCcw, XCircle, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";

type TrashTask = {
  _id: string;
  title: string;
  deletedOn: string;
  originalStatus: string;
  status: string;
};

type TrashProject = {
  _id: string;
  title: string;
  deletedOn: string;
  originalStatus: string;
  status: string;
};
export default function TrashSection() {
  const [activeTab, setActiveTab] = useState<"tasks" | "projects">("tasks");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [trashTasks, setTrashTasks] = useState<TrashTask[]>([]);
  const [trashProjects, setTrashProjects] = useState<TrashProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get auth token
  const getAuthToken = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    return authUser.token;
  };

  // Fetch trashed items from API
  const fetchTrashedItems = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const res = await fetch("http://localhost:3000/trash", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch trashed items");
      }

      const data = await res.json();
      setTrashTasks(data.tasks || []);
      setTrashProjects(data.projects || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load trashed items");
    } finally {
      setIsLoading(false);
    }
  };

  // Restore items
  const restoreItems = async (
    itemIds: string[],
    type: "tasks" | "projects"
  ) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const body =
        type === "tasks" ? { taskIds: itemIds } : { projectIds: itemIds };

      const res = await fetch("http://localhost:3000/trash/bulk-restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to restore items");
      }

      toast.success(`${type} restored successfully`);
      setSelectedItems([]);
      fetchTrashedItems(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || "Failed to restore items");
    }
  };

  // Permanently delete items
  const permanentlyDeleteItems = async (
    itemIds: string[],
    type: "tasks" | "projects"
  ) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const body =
        type === "tasks" ? { taskIds: itemIds } : { projectIds: itemIds };

      const res = await fetch("http://localhost:3000/trash/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to delete items");
      }

      toast.success(`${type} permanently deleted`);
      setSelectedItems([]);
      fetchTrashedItems(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || "Failed to delete items");
    }
  };

  // Empty trash
  const emptyTrash = async () => {
    if (
      !window.confirm(
        "Are you sure you want to empty the trash? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const res = await fetch("http://localhost:3000/trash/empty", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to empty trash");
      }

      toast.success("Trash emptied successfully");
      fetchTrashedItems(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || "Failed to empty trash");
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchTrashedItems();
  }, []);

  const currentData = activeTab === "tasks" ? trashTasks : trashProjects;
  const filteredData = currentData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectAllRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedItems.length > 0 && selectedItems.length < currentData.length;
    }
  }, [selectedItems, currentData.length]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedItems(currentData.map((item) => item._id));
    else setSelectedItems([]);
  };

  const handleSelectOne = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkRestore = () => {
    if (selectedItems.length === 0) return;
    restoreItems(selectedItems, activeTab);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedItems.length} ${activeTab}?`
      )
    ) {
      permanentlyDeleteItems(selectedItems, activeTab);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="p-4 rounded-2xl flex flex-col w-full bg-[var(--bg)] border border-[var(--border)]">
      {/* Top Controls */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--light-text)] font-medium " />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border   font-medium  border-[var(--border)] pl-10 pr-3 py-2 rounded-xl w-full  focus:border-[var(--accent-color)] outline-none text-sm"
          />
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <button
            onClick={emptyTrash}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-red-500 cursor-pointer text-red-600 hover:bg-red-500  hover:text-white transition"
          >
            <Trash2 size={16} />
            Empty Trash
          </button>

          <button
            disabled={selectedItems.length === 0}
            onClick={handleBulkDelete}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition cursor-pointer ${
              selectedItems.length > 0
                ? "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                : "border-[var(--border)] text-[var(--light-text)] cursor-not-allowed"
            }`}
          >
            <XCircle size={16} />
            Delete Permanently
          </button>

          <button
            disabled={selectedItems.length === 0}
            onClick={handleBulkRestore}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition cursor-pointer ${
              selectedItems.length > 0
                ? "border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] hover:text-white "
                : "border-[var(--border)] text-[var(--light-text)] cursor-not-allowed"
            }`}
          >
            <RotateCcw size={16} />
            Restore
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-between items-center border-b border-[var(--border)] ">
        <div className="flex gap-6">
          {["tasks", "projects"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "tasks" | "projects");
                setSelectedItems([]);
                setSearchQuery("");
              }}
              className={`pb-2 font-medium cursor-pointer ${
                activeTab === tab
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[var(--bg)] rounded-xl border border-[var(--border)] shadow-sm mt-4">
        {isLoading ? (
          <div className="text-center py-10 text-[var(--light-text)]">
            Loading trashed items...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-10 text-[var(--light-text)]">
            <Trash2
              size={40}
              className="mx-auto mb-3 text-[var(--light-text)]"
            />
            No {activeTab} found in trash
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--cards-bg)] text-[var(--light-text)]">
                <th className=" w-12 p-3 text-left">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="accent-[var(--accent-color)] cursor-pointer"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedItems.length === currentData.length &&
                      currentData.length > 0
                    }
                  />
                </th>
                <th className="p-2 text-left">
                  {activeTab === "tasks" ? "Task Name" : "Project Name"}
                </th>
                <th className="p-2 text-left">Deleted On</th>
                <th className="p-2 text-left">Original Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr
                  key={item._id}
                  className={` transition ${
                    i % 2 === 0 ? "bg-[var(--bg)]" : "bg-[var(--cards-bg)]"
                  }`}
                >
                  <td className="p-3 pt-2 pb-2 ">
                    <input
                      type="checkbox"
                      className="accent-[var(--accent-color)] cursor-pointer"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectOne(item._id)}
                    />
                  </td>
                  <td className="p-2 font-medium text-[var(--text-primary)] ">
                    {item.title}
                  </td>
                  <td className="p-2 text-[var(--light-text)]">
                    {formatDate(item.deletedOn)}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === "completed" ||
                        item.status === "Completed" ||
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : item.status === "in progress" ||
                            item.status === "In Progress" ||
                            item.status === "On Hold"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      title="Restore"
                      onClick={() => restoreItems([item._id], activeTab)}
                      className="p-1.5 rounded-md hover:bg-[var(--accent-btn-hover-color)] text-[var(--accent-color)]"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button
                      title="Delete Permanently"
                      onClick={() =>
                        permanentlyDeleteItems([item._id], activeTab)
                      }
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-600"
                    >
                      <XCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--bg)] border border-[var(--border)] shadow-lg px-6 py-3 rounded-xl flex gap-4 items-center animate-fadeIn">
          <p className="text-sm text-[var(--light-text)]">
            {selectedItems.length} selected
          </p>
          <button
            onClick={handleBulkRestore}
            className="px-3 py-1.5 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] hover:text-white cursor-pointer"
          >
            Restore Selected
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 text-sm cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
}

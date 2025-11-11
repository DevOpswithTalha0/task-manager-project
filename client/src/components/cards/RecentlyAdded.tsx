import { Bold, Italic, Underline, AlignLeft } from "lucide-react";

export default function RecentlyAdded() {
  return (
    <div className="flex flex-col border border-[var(--border)]  bg-[var(--cards-bg)]  rounded-xl ">
      {/* Header */}
      <header className="border-b border-[var(--border)]  px-4 py-3 flex justify-between items-center">
        <p className="text-lg font-medium  ">Recently Added</p>
        <p>See All Tasks</p>
      </header>

      {/* Main Text Area */}
      <main className=""></main>

      {/* Footer Toolbar */}
      <footer className="flex gap-3 items-center px-4 py-3 border-t border-[var(--border)] ">
        <button className="p-2 rounded-lg hover:bg-[var(--hover-bg)] ">
          <Bold size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-[var(--hover-bg)] dark:hover:bg-gray-800">
          <Italic size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-[var(--hover-bg)] ">
          <Underline size={18} />
        </button>
        <button className="p-2 rounded-lg hover:hover:bg-[var(--hover-bg)] dark:hover:bg-gray-800">
          <AlignLeft size={18} />
        </button>
      </footer>
    </div>
  );
}

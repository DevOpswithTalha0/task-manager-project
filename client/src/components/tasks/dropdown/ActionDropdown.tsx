type ActionDropdownProps = {
  onEditTask?: () => void;
  onDeleteTask?: () => void;
};

export default function ActionDropdown({
  onEditTask,
  onDeleteTask,
}: ActionDropdownProps) {
  const actions = [
    { label: "Edit Task", onClick: onEditTask, text: "edited" },
    { label: "Delete Task", onClick: onDeleteTask, text: "deleted" },
  ];

  return (
    <div className="bg-[var(--bg)] z-[9999] shadow-md rounded-md border border-[var(--border)] p-2 w-40">
      {actions.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            console.log(item.text), item.onClick?.();
          }}
          className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] rounded-md"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

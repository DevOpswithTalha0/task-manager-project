type ActionDropdownProps = {
  onViewDetails?: () => void;
  onEditProject?: () => void;
  onAddTask?: () => void;
  onDeleteProject?: () => void;
};

export default function ActionDropdown({
  onViewDetails,
  onEditProject,
  onAddTask,
  onDeleteProject,
}: ActionDropdownProps) {
  const actions = [
    { label: "View Details", onClick: onViewDetails },
    { label: "Edit Project", onClick: onEditProject },
    { label: "Add Task", onClick: onAddTask },
    { label: "Delete Project", onClick: onDeleteProject },
  ];

  return (
    <div className="bg-[var(--bg)] z-10 shadow-md rounded-md border border-[var(--border)] p-2 w-40">
      {actions.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] rounded-md"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const collection = [
    { name: "Total Tasks", count: 8 },
    { name: "Total Projects", count: 3 },
    { name: "Active Projects", count: 5 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {collection.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition border-gray-200  gap-3"
        >
          <p className="text-sm  text-center font-medium text-gray-500 dark:text-gray-400 mt-1">
            {item.name}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {item.count}
          </p>
        </div>
      ))}
    </div>
  );
}

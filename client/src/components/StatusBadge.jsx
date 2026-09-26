export default function StatusBadge({ status }) {
  const styles = {
    Open: "bg-green-100 text-green-700 border-green-200",
    "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
    Closed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const cls =
    styles[status] || "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
    >
      {status}
    </span>
  );
}
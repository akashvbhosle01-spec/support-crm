export default function PriorityBadge({ priority }) {
  const styles = {
    Low: "bg-slate-100 text-slate-600 border-slate-200",
    Medium: "bg-blue-50 text-blue-700 border-blue-200",
    High: "bg-orange-100 text-orange-700 border-orange-200",
    Urgent: "bg-red-100 text-red-700 border-red-200",
  };

  const cls = styles[priority] || styles.Medium;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}
    >
      {priority}
    </span>
  );
}
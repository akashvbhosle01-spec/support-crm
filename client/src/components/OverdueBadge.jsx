export default function OverdueBadge({ isOverdue, slaDueAt }) {
  if (!isOverdue) return null;

  const dueDate = slaDueAt ? new Date(slaDueAt) : null;
  const hoursOverdue = dueDate
    ? Math.round((Date.now() - dueDate.getTime()) / (1000 * 60 * 60))
    : 0;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white"
      title={`SLA breached ${hoursOverdue}h ago`}
    >
      ⚠ Overdue
    </span>
  );
}
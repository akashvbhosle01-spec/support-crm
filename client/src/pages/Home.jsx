import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import TicketSkeleton from "../components/TicketSkeleton";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import OverdueBadge from "../components/OverdueBadge";
import { formatDate } from "../utils/formatDate";

export default function Home() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Fetch tickets whenever search or status changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      const res = await api.get("/tickets", { params });

      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load tickets. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold text-gray-800"
          >
            Support CRM
          </Link>

          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
          >
            + New Ticket
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by ID, name, email, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {/* Clear Search Button */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                aria-label="Clear search"
                title="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Skeleton Loading */}
          {loading && <TicketSkeleton />}

          {/* Error */}
          {!loading && error && (
            <div className="p-6 text-center text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && tickets.length === 0 && (
            <EmptyState
              title="No tickets found"
              subtitle={
                search || status
                  ? "Try changing your search or filter."
                  : "Create your first ticket to get started."
              }
            />
          )}

          {/* Ticket Table */}
          {!loading && !error && tickets.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((t) => (
                    <tr
                      key={t.ticket_id}
                      onClick={() =>
                        navigate(`/tickets/${t.ticket_id}`)
                      }
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    >
                      {/* Ticket ID */}
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">
                        {t.ticket_id}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {t.customer_name}
                      </td>

                      {/* Subject + Overdue */}
                      <td className="px-4 py-3 text-gray-600 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="truncate">
                            {t.subject}
                          </span>

                          <OverdueBadge
                            isOverdue={t.is_overdue}
                            slaDueAt={t.sla_due_at}
                          />
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3">
                        <PriorityBadge priority={t.priority} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {formatDate(t.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Count */}
        {!loading && !error && tickets.length > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            Showing {tickets.length} ticket
            {tickets.length !== 1 ? "s" : ""}
          </p>
        )}
      </main>
    </div>
  );
}
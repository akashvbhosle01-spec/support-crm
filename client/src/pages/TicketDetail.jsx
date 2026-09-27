import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import OverdueBadge from "../components/OverdueBadge";
import NotesTimeline from "../components/NotesTimeline";
import { formatDateTime } from "../utils/formatDate";

export default function TicketDetail() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");
      setNotFound(false);

      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError("Failed to load ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!ticket || newStatus === ticket.status) return;

    try {
      setStatusUpdating(true);
      setActionError("");

      await api.put(`/tickets/${id}`, { status: newStatus });

      setTicket((prev) => ({
        ...prev,
        status: newStatus,
        updated_at: new Date().toISOString(),
      }));
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.error || "Failed to update status."
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!noteText.trim()) return;

    try {
      setNoteSubmitting(true);
      setActionError("");

      await api.put(`/tickets/${id}`, {
        notes: noteText.trim(),
      });

      await fetchTicket();
      setNoteText("");
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.error || "Failed to add note."
      );
    } finally {
      setNoteSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loader message="Loading ticket..." />
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Ticket not found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            The ticket you're looking for doesn't exist or was removed.
          </p>

          <Link
            to="/"
            className="inline-block mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to tickets
          </Link>
        </main>
      </div>
    );
  }

  // Generic error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600 text-sm">{error}</p>

          <button
            onClick={fetchTicket}
            className="mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </main>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* Action error banner */}
        {actionError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            ⚠️ {actionError}
          </div>
        )}

        {/* Ticket header card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

            <div className="min-w-0">
              <p className="font-mono text-xs text-blue-600 mb-1">
                {ticket.ticket_id}
              </p>

              <h1 className="text-xl font-bold text-gray-800 break-words">
                {ticket.subject}
              </h1>

              <p className="text-xs text-gray-500 mt-2">
                Created {formatDateTime(ticket.created_at)}

                {ticket.updated_at !== ticket.created_at && (
                  <>
                    {" "}
                    • Updated {formatDateTime(ticket.updated_at)}
                  </>
                )}
              </p>
            </div>

            {/* Priority + Status */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <PriorityBadge priority={ticket.priority} />

              <StatusBadge status={ticket.status} />

              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusUpdating}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>

              {statusUpdating && (
                <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Customer
          </h2>

          <p className="text-sm text-gray-800 font-medium">
            {ticket.customer_name}
          </p>

          <a
            href={`mailto:${ticket.customer_email}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {ticket.customer_email}
          </a>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Description
          </h2>

          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* SLA Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            SLA
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <p className="text-sm text-gray-800">
                Due by{" "}
                <span className="font-medium">
                  {formatDateTime(ticket.sla_due_at)}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Based on{" "}
                <span className="font-medium">
                  {ticket.priority}
                </span>{" "}
                priority
              </p>
            </div>

            <OverdueBadge
              isOverdue={ticket.is_overdue}
              slaDueAt={ticket.sla_due_at}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Notes ({ticket.notes?.length || 0})
          </h2>

          <NotesTimeline notes={ticket.notes} />

          {/* Add note form */}
          <form onSubmit={handleAddNote} className="mt-5">
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note... (e.g. Investigated logs, contacted customer)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={noteSubmitting || !noteText.trim()}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-md transition"
              >
                {noteSubmitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}

                {noteSubmitting ? "Adding..." : "Add Note"}
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-xl font-bold text-gray-800"
        >
          Support CRM
        </Link>

        <Link
          to="/"
          className="text-sm text-gray-600 hover:text-gray-800 transition"
        >
          ← Back to tickets
        </Link>

      </div>
    </header>
  );
}
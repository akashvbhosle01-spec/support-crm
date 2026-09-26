import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import { formatDateTime } from "../utils/formatDate";

export default function TicketDetail() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error || "Failed to load ticket."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-800">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading && <Loader message="Loading ticket..." />}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 text-sm">{error}</p>

            <Link
              to="/"
              className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Back to tickets
            </Link>
          </div>
        )}

        {!loading && !error && ticket && (
          <>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-blue-600 mb-1">
                    {ticket.ticket_id}
                  </p>

                  <h1 className="text-2xl font-bold text-gray-800">
                    {ticket.subject}
                  </h1>
                </div>

                <StatusBadge status={ticket.status} />
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {ticket.customer_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {ticket.customer_email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDateTime(ticket.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDateTime(ticket.updated_at)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Description
                  </p>

                  <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Notes
              </h2>

              {ticket.notes?.length === 0 ? (
                <p className="text-sm text-gray-500 mt-3">
                  No notes added yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {ticket.notes.map((note, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <p className="text-sm text-gray-700">
                        {note.note_text}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        {formatDateTime(note.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
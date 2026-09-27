import { formatDateTime } from "../utils/formatDate";

export default function NotesTimeline({ notes }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4">
        No notes yet. Add the first one below.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note, idx) => (
        <div
          key={idx}
          className="bg-gray-50 border border-gray-200 rounded-md p-4"
        >
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {note.note_text}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {formatDateTime(note.created_at)}
          </p>
        </div>
      ))}
    </div>
  );
}
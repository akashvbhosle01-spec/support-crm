import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }
    if (!form.customer_email.trim()) {
      newErrors.customer_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email.trim())) {
      newErrors.customer_email = "Please enter a valid email";
    }
    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (form.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      const res = await api.post("/tickets", {
        customer_name: form.customer_name.trim(),
        customer_email: form.customer_email.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
      });

      setSuccess(`Ticket ${res.data.ticket_id} created successfully!`);

      // Redirect after a short delay so user sees the success message
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.error || "Failed to create ticket. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Create a new ticket
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Fill in the details below. Fields marked with <span className="text-red-500">*</span> are required.
          </p>

          {success && (
            <div className="mb-5 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
              ✅ {success}
            </div>
          )}

          {serverError && (
            <div className="mb-5 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Customer Name */}
            <div className="mb-5">
              <label
                htmlFor="customer_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={form.customer_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition ${
                  errors.customer_name
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.customer_name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.customer_name}
                </p>
              )}
            </div>

            {/* Customer Email */}
            <div className="mb-5">
              <label
                htmlFor="customer_email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                id="customer_email"
                name="customer_email"
                type="email"
                value={form.customer_email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition ${
                  errors.customer_email
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.customer_email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.customer_email}
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="mb-5">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Unable to login"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition ${
                  errors.subject
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.subject && (
                <p className="text-xs text-red-600 mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition resize-none ${
                  errors.description
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-md transition"
              >
                {submitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
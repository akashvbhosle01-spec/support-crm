const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");
const Note = require("../models/Note");
const generateTicketId = require("../utils/generateTicketId");
const { getSlaDueAt, isOverdue } = require("../utils/sla");

// POST /api/tickets — Create a new ticket
router.post("/", async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      subject,
      description,
      priority,
    } = req.body;

    // Validation
    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({
        error:
          "All fields are required: customer_name, customer_email, subject, description",
      });
    }

    // Validate priority
    const validPriorities = ["Low", "Medium", "High", "Urgent"];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error:
          "Invalid priority. Must be: Low, Medium, High, or Urgent",
      });
    }

    const ticket_id = await generateTicketId();

    const finalPriority = priority || "Medium";

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
      priority: finalPriority,
    });

    const sla_due_at = getSlaDueAt(ticket.createdAt, finalPriority);

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.createdAt,
      priority: ticket.priority,
      sla_due_at,
      is_overdue: isOverdue(
        ticket.createdAt,
        ticket.priority,
        ticket.status
      ),
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    res.status(500).json({
      error: "Failed to create ticket",
      details: error.message,
    });
  }
});

// GET /api/tickets — List all tickets with optional search and filter
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, "i");

      query.$or = [
        { ticket_id: searchRegex },
        { customer_name: searchRegex },
        { customer_email: searchRegex },
        { subject: searchRegex },
        { description: searchRegex },
      ];
    }

    const tickets = await Ticket.find(query)
      .select(
        "ticket_id customer_name subject status priority createdAt"
      )
      .sort({ createdAt: -1 });

    const formattedTickets = tickets.map((ticket) => {
      const sla_due_at = getSlaDueAt(
        ticket.createdAt,
        ticket.priority || "Medium"
      );

      return {
        ticket_id: ticket.ticket_id,
        customer_name: ticket.customer_name,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority || "Medium",
        created_at: ticket.createdAt,
        sla_due_at,
        is_overdue: isOverdue(
          ticket.createdAt,
          ticket.priority || "Medium",
          ticket.status
        ),
      };
    });

    res.json(formattedTickets);
  } catch (error) {
    console.error("List tickets error:", error.message);

    res.status(500).json({
      error: "Failed to fetch tickets",
    });
  }
});

// GET /api/tickets/:id — Get single ticket with notes
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({ ticket_id: id });

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    const notes = await Note.find({
      ticket_id: id,
    }).sort({ createdAt: 1 });

    const finalPriority = ticket.priority || "Medium";

    const sla_due_at = getSlaDueAt(
      ticket.createdAt,
      finalPriority
    );

    const overdue = isOverdue(
      ticket.createdAt,
      finalPriority,
      ticket.status
    );

    res.json({
      ticket_id: ticket.ticket_id,
      customer_name: ticket.customer_name,
      customer_email: ticket.customer_email,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: finalPriority,
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
      sla_due_at,
      is_overdue: overdue,

      notes: notes.map((n) => ({
        note_text: n.note_text,
        created_at: n.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get ticket error:", error.message);

    res.status(500).json({
      error: "Failed to fetch ticket",
    });
  }
});

// PUT /api/tickets/:id — Update status, priority and/or add note
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, notes } = req.body;

    const ticket = await Ticket.findOne({
      ticket_id: id,
    });

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = [
        "Open",
        "In Progress",
        "Closed",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error:
            "Invalid status. Must be: Open, In Progress, or Closed",
        });
      }

      ticket.status = status;
    }

    // Validate priority if provided
    if (priority) {
      const validPriorities = [
        "Low",
        "Medium",
        "High",
        "Urgent",
      ];

      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          error:
            "Invalid priority. Must be: Low, Medium, High, or Urgent",
        });
      }

      ticket.priority = priority;
    }

    // Add note if provided
    if (notes && notes.trim()) {
      await Note.create({
        ticket_id: id,
        note_text: notes.trim(),
      });
    }

    await ticket.save();

    const finalPriority = ticket.priority || "Medium";

    const sla_due_at = getSlaDueAt(
      ticket.createdAt,
      finalPriority
    );

    const overdue = isOverdue(
      ticket.createdAt,
      finalPriority,
      ticket.status
    );

    res.json({
      success: true,
      ticket_id: ticket.ticket_id,
      status: ticket.status,
      priority: finalPriority,
      updated_at: ticket.updatedAt,
      sla_due_at,
      is_overdue: overdue,
    });
  } catch (error) {
    console.error("Update ticket error:", error.message);

    res.status(500).json({
      error: "Failed to update ticket",
    });
  }
});

module.exports = router;
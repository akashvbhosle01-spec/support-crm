const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const generateTicketId = require("../utils/generateTicketId");

// POST /api/tickets — Create a new ticket
router.post("/", async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    // Validation
    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({
        error:
          "All fields are required: customer_name, customer_email, subject, description",
      });
    }

    const ticket_id = await generateTicketId();

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.createdAt,
    });
} catch (error) {
  console.error("Create ticket error:", error);
  res.status(500).json({
    error: "Failed to create ticket",
    details: error.message,
  });
}
});

module.exports = router;
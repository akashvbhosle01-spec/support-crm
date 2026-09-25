const Ticket = require("../models/Ticket");

const generateTicketId = async () => {
  const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });

  if (!lastTicket) {
    return "TKT-001";
  }

  const lastNumber = parseInt(lastTicket.ticket_id.split("-")[1], 10);
  const nextNumber = lastNumber + 1;
  const paddedNumber = String(nextNumber).padStart(3, "0");

  return `TKT-${paddedNumber}`;
};

module.exports = generateTicketId;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const ticketRoutes = require("./routes/tickets");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tickets", ticketRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Support CRM API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
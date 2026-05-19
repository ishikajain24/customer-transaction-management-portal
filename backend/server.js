const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Allow requests from your React frontend only
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth",         require("./routes/auth"));
app.use("/api/customers",    require("./routes/customers"));
app.use("/api/transactions", require("./routes/transactions"));

// Health check — useful for uptime monitoring (UptimeRobot, Railway)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Shree Jewellers API",
  });
});

// 404 handler — catches any unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

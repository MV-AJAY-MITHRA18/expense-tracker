// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON

// API Routes
app.use("/api/transactions", transactionRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

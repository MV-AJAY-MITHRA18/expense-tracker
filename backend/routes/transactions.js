import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get summary for a user (MUST be before /:userId to avoid route conflict)
router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📊 Fetching summary for user:", userId);
    const result = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
      FROM transactions WHERE user_id = $1`,
      [userId]
    );
    console.log("📊 Summary result:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all transactions for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📋 Fetching transactions for user:", userId);
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    console.log("📋 Found", result.rows.length, "transactions");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add new transaction
router.post("/", async (req, res) => {
  const { user_id, title, amount, category, type } = req.body;
  console.log("📝 Creating transaction:", { user_id, title, amount, category, type });
  try {
    const result = await pool.query(
      "INSERT INTO transactions (user_id, title, amount, category, type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, title, amount, category || 'other', type || 'expense']
    );
    console.log("✅ Transaction created:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error creating transaction:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Delete transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

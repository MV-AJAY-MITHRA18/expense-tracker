import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add new transaction
router.post("/", async (req, res) => {
  const { title, amount } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO transactions (title, amount) VALUES ($1, $2) RETURNING *",
      [title, amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

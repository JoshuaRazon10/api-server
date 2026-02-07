import express from "express";
import { db } from "../db.js";
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

// POST: Save mood and get AI response
router.post("/", async (req, res) => {
  const { user_id, mood_text } = req.body;
  try {
    // Save User Mood
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)",
      [user_id, mood_text]
    );

    // Get AI Response
    const aiMessage = await getAIResponse(mood_text);

    // Save AI Response to Database
    await db.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)",
      [result.insertId, aiMessage]
    );

    res.json({ message: "Mood saved", aiMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: View all moods with their AI responses
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.full_name, m.mood_text, a.ai_message 
      FROM users u 
      JOIN mood_entries m ON u.id = m.user_id 
      JOIN ai_responses a ON m.id = a.mood_entry_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
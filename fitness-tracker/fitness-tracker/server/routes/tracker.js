const express = require("express");
const mongoose = require("mongoose");
const Entry = require("../models/Entry");
const Goal = require("../models/Goal");

const router = express.Router();

const TYPES = ["workout", "meal", "water", "weight"];
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const goalFields = (g) => ({
  calories: g.calories,
  water: g.water,
  workoutMinutes: g.workoutMinutes,
});

// ---------- entries ----------
// GET /api/entries?date=YYYY-MM-DD
router.get("/entries", async (req, res) => {
  const filter = isDate(req.query.date) ? { date: req.query.date } : {};
  const list = await Entry.find(filter).sort({ createdAt: -1 });
  res.json(list);
});

// POST /api/entries  { type, name, value, date }
router.post("/entries", async (req, res) => {
  const { type, name, value, date } = req.body;
  if (!TYPES.includes(type)) {
    return res.status(400).json({ error: "type must be one of " + TYPES.join(", ") });
  }
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    return res.status(400).json({ error: "value must be a positive number" });
  }
  if (!isDate(date)) {
    return res.status(400).json({ error: "date must be YYYY-MM-DD" });
  }
  const entry = await Entry.create({
    type,
    name: (name || "").toString().trim().slice(0, 80) || type,
    value: num,
    date,
  });
  res.status(201).json(entry);
});

// DELETE /api/entries/:id
router.delete("/entries/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const gone = await Entry.findByIdAndDelete(req.params.id);
  if (!gone) return res.status(404).json({ error: "entry not found" });
  res.json({ ok: true });
});

// ---------- summary (last N days ending at `end`) ----------
// GET /api/summary?end=YYYY-MM-DD&days=7
router.get("/summary", async (req, res) => {
  const end = isDate(req.query.end) ? req.query.end : new Date().toISOString().slice(0, 10);
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 31);

  // list of the dates we need, oldest first
  const keys = [];
  const endDate = new Date(end + "T00:00:00Z");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }

  const entries = await Entry.find({ date: { $gte: keys[0], $lte: keys[keys.length - 1] } }).sort({
    createdAt: 1,
  });

  const result = keys.map((key) => {
    const day = entries.filter((e) => e.date === key);
    const sum = (t) => day.filter((e) => e.type === t).reduce((s, e) => s + e.value, 0);
    const weights = day.filter((e) => e.type === "weight");
    return {
      date: key,
      calories: sum("meal"),
      workoutMinutes: sum("workout"),
      water: sum("water"),
      weight: weights.length ? weights[weights.length - 1].value : null,
    };
  });
  res.json(result);
});

// latest recorded weight overall
router.get("/weight/latest", async (req, res) => {
  const w = await Entry.findOne({ type: "weight" }).sort({ date: -1, createdAt: -1 });
  res.json(w || null);
});

// ---------- goals ----------
router.get("/goals", async (req, res) => {
  const goal = await Goal.findOneAndUpdate({ key: "default" }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });
  res.json(goalFields(goal));
});

router.put("/goals", async (req, res) => {
  const update = {};
  for (const key of ["calories", "water", "workoutMinutes"]) {
    if (req.body[key] !== undefined) {
      const n = Number(req.body[key]);
      if (!Number.isFinite(n) || n <= 0) {
        return res.status(400).json({ error: key + " must be a positive number" });
      }
      update[key] = n;
    }
  }
  const goal = await Goal.findOneAndUpdate({ key: "default" }, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  res.json(goalFields(goal));
});

module.exports = router;

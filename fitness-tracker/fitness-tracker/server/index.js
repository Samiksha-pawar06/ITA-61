const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

// ---------- tiny JSON-file "database" ----------
const DEFAULT_DB = {
  nextId: 1,
  entries: [],
  goals: { calories: 2000, water: 8, workoutMinutes: 30 },
};

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const TYPES = ["workout", "meal", "water", "weight"];
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

// ---------- entries ----------
// GET /api/entries?date=YYYY-MM-DD
app.get("/api/entries", (req, res) => {
  const { date } = req.query;
  const db = readDB();
  let list = db.entries;
  if (date) list = list.filter((e) => e.date === date);
  res.json(list.sort((a, b) => b.id - a.id));
});

// POST /api/entries  { type, name, value, date }
app.post("/api/entries", (req, res) => {
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
  const db = readDB();
  const entry = {
    id: db.nextId++,
    type,
    name: (name || "").toString().trim().slice(0, 80) || type,
    value: num,
    date,
  };
  db.entries.push(entry);
  writeDB(db);
  res.status(201).json(entry);
});

// DELETE /api/entries/:id
app.delete("/api/entries/:id", (req, res) => {
  const id = Number(req.params.id);
  const db = readDB();
  const before = db.entries.length;
  db.entries = db.entries.filter((e) => e.id !== id);
  if (db.entries.length === before) {
    return res.status(404).json({ error: "entry not found" });
  }
  writeDB(db);
  res.json({ ok: true });
});

// ---------- summary (last N days ending at `end`) ----------
// GET /api/summary?end=YYYY-MM-DD&days=7
app.get("/api/summary", (req, res) => {
  const end = isDate(req.query.end) ? req.query.end : new Date().toISOString().slice(0, 10);
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 31);
  const db = readDB();

  const result = [];
  const endDate = new Date(end + "T00:00:00Z");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const day = db.entries.filter((e) => e.date === key);
    const sum = (t) => day.filter((e) => e.type === t).reduce((s, e) => s + e.value, 0);
    const weights = day.filter((e) => e.type === "weight");
    result.push({
      date: key,
      calories: sum("meal"),
      workoutMinutes: sum("workout"),
      water: sum("water"),
      weight: weights.length ? weights[weights.length - 1].value : null,
    });
  }
  res.json(result);
});

// latest recorded weight overall
app.get("/api/weight/latest", (req, res) => {
  const db = readDB();
  const w = db.entries
    .filter((e) => e.type === "weight")
    .sort((a, b) => (a.date === b.date ? a.id - b.id : a.date.localeCompare(b.date)))
    .pop();
  res.json(w || null);
});

// ---------- goals ----------
app.get("/api/goals", (req, res) => res.json(readDB().goals));

app.put("/api/goals", (req, res) => {
  const db = readDB();
  const next = { ...db.goals };
  for (const key of ["calories", "water", "workoutMinutes"]) {
    if (req.body[key] !== undefined) {
      const n = Number(req.body[key]);
      if (!Number.isFinite(n) || n <= 0) {
        return res.status(400).json({ error: key + " must be a positive number" });
      }
      next[key] = n;
    }
  }
  db.goals = next;
  writeDB(db);
  res.json(db.goals);
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log("Fitness API running on http://localhost:" + PORT);
});

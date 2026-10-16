const express = require("express");
const mongoose = require("mongoose");
const Resource = require("../models/Resource");
const { buildResourceFilter } = require("../utils/search");

const router = express.Router();
const { TYPES, CATEGORIES } = Resource;

const checkId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  next();
};

function cleanTags(input) {
  const list = Array.isArray(input) ? input : String(input || "").split(",");
  return list
    .map((t) => String(t).trim().toLowerCase())
    .filter(Boolean)
    .map((t) => t.slice(0, 30))
    .slice(0, 10);
}

function isHttpUrl(text) {
  try {
    const u = new URL(text);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// GET /api/resources?q=yoga&type=video&category=workout&favorites=true&page=1&limit=12
router.get("/", async (req, res) => {
  const filter = buildResourceFilter(req.query);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

  const [items, total] = await Promise.all([
    Resource.find(filter)
      .sort({ custom: -1, createdAt: -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Resource.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

// GET /api/resources/meta  -> counts for the filter chips
router.get("/meta", async (req, res) => {
  const [byType, byCategory, favorites] = await Promise.all([
    Resource.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    Resource.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    Resource.countDocuments({ favorite: true }),
  ]);
  const toObject = (rows) => Object.fromEntries(rows.map((r) => [r._id, r.count]));
  res.json({
    types: TYPES,
    categories: CATEGORIES,
    typeCounts: toObject(byType),
    categoryCounts: toObject(byCategory),
    favorites,
  });
});

// POST /api/resources  -> add your own video / article / tip / recipe
router.post("/", async (req, res) => {
  const { title, description, body, type, category, url, source, level } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  if (!TYPES.includes(type)) {
    return res.status(400).json({ error: "type must be one of " + TYPES.join(", ") });
  }
  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "category must be one of " + CATEGORIES.join(", ") });
  }
  if (url && !isHttpUrl(url)) {
    return res.status(400).json({ error: "url must start with http:// or https://" });
  }
  if (!url && !(body && String(body).trim())) {
    return res.status(400).json({ error: "add a link (url) or some text" });
  }

  const doc = await Resource.create({
    title,
    description,
    body,
    type,
    category: category || "general",
    url: url || "",
    source,
    level: level || "all",
    tags: cleanTags(req.body.tags),
    custom: true,
  });
  res.status(201).json(doc);
});

// PATCH /api/resources/:id/favorite  -> toggle the star
router.patch("/:id/favorite", checkId, async (req, res) => {
  const doc = await Resource.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "resource not found" });
  doc.favorite = !doc.favorite;
  await doc.save();
  res.json(doc);
});

// DELETE /api/resources/:id
router.delete("/:id", checkId, async (req, res) => {
  const doc = await Resource.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "resource not found" });
  res.json({ ok: true });
});

module.exports = router;

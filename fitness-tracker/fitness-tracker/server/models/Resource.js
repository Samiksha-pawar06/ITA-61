const mongoose = require("mongoose");

const TYPES = ["video", "article", "tip", "recipe"];
const CATEGORIES = [
  "workout",
  "yoga",
  "nutrition",
  "weight-loss",
  "mental-health",
  "sleep",
  "hydration",
  "general",
];

// One document = one item in the Health Library (a video, article, tip or recipe)
const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    body: { type: String, trim: true, maxlength: 2000, default: "" }, // text shown inside tips/recipes
    type: { type: String, enum: TYPES, required: true },
    category: { type: String, enum: CATEGORIES, default: "general" },
    tags: { type: [String], default: [] },
    url: { type: String, trim: true, default: "" },
    source: { type: String, trim: true, maxlength: 60, default: "" },
    level: { type: String, enum: ["beginner", "intermediate", "advanced", "all"], default: "all" },
    favorite: { type: Boolean, default: false },
    custom: { type: Boolean, default: false }, // true = added by the user, false = built-in
  },
  { timestamps: true }
);

// Text index (lets you also use MongoDB's $text search in the shell / Compass)
resourceSchema.index(
  { title: "text", description: "text", tags: "text", body: "text" },
  { weights: { title: 5, tags: 3, description: 2, body: 1 } }
);

resourceSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
module.exports.TYPES = TYPES;
module.exports.CATEGORIES = CATEGORIES;

const mongoose = require("mongoose");

// Only one document is ever stored (key = "default")
const goalSchema = new mongoose.Schema({
  key: { type: String, default: "default", unique: true },
  calories: { type: Number, default: 2000, min: 1 },
  water: { type: Number, default: 8, min: 1 },
  workoutMinutes: { type: Number, default: 30, min: 1 },
});

module.exports = mongoose.model("Goal", goalSchema);

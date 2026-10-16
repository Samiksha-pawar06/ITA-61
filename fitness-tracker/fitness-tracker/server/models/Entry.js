const mongoose = require("mongoose");

// One document = one thing the user logged (a workout, a meal, a glass of water, a weight)
const entrySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["workout", "meal", "water", "weight"], required: true },
    name: { type: String, trim: true, maxlength: 80, default: "" },
    value: { type: Number, required: true, min: 0 },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, // YYYY-MM-DD
  },
  { timestamps: true }
);

entrySchema.index({ date: 1 });

// Send "id" to the frontend instead of MongoDB's "_id"
entrySchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Entry", entrySchema);

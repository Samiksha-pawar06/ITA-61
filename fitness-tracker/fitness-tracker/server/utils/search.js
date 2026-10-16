// Builds a MongoDB filter from the search box + dropdown filters.
// Example: "back pain yoga" -> every word must appear somewhere in
// the title, description, tags, body or source (partial words work too).

const FIELDS = ["title", "description", "tags", "body", "source"];

// Stops users from breaking the regex with characters like ( ) [ ] * +
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildResourceFilter({ q, type, category, favorites }) {
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (favorites === "true" || favorites === true) filter.favorite = true;

  const words = String(q || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6); // limit to 6 words

  if (words.length) {
    filter.$and = words.map((word) => {
      const rx = new RegExp(escapeRegex(word), "i");
      return { $or: FIELDS.map((field) => ({ [field]: rx })) };
    });
  }
  return filter;
}

module.exports = { buildResourceFilter, escapeRegex };

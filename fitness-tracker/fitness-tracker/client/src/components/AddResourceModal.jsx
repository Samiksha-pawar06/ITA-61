import { useState } from "react";

const TYPES = ["video", "article", "tip", "recipe"];
const CATEGORIES = ["workout", "yoga", "nutrition", "weight-loss", "mental-health", "sleep", "hydration", "general"];
const LEVELS = ["all", "beginner", "intermediate", "advanced"];

export default function AddResourceModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    type: "video",
    title: "",
    description: "",
    url: "",
    body: "",
    category: "workout",
    level: "all",
    tags: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const needsText = form.type === "tip" || form.type === "recipe";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Please enter a title");
    if (!form.url.trim() && !form.body.trim()) return setError("Add a link or some text");
    setBusy(true);
    try {
      await onSave({ ...form, source: form.url ? "Added by you" : "" });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="card modal modal-wide" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Add to Health Library</h2>

        <div className="row2">
          <label>
            Type
            <select value={form.type} onChange={set("type")}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Title
          <input type="text" value={form.title} onChange={set("title")} placeholder="e.g. Morning yoga flow" />
        </label>

        <label>
          Link {form.type === "video" && "(paste a YouTube link to play it inside the app)"}
          <input type="text" value={form.url} onChange={set("url")} placeholder="https://..." />
        </label>

        <label>
          Short description
          <input type="text" value={form.description} onChange={set("description")} />
        </label>

        {(needsText || !form.url) && (
          <label>
            {form.type === "recipe" ? "Recipe steps" : "Text"}
            <textarea rows="4" value={form.body} onChange={set("body")} />
          </label>
        )}

        <div className="row2">
          <label>
            Level
            <select value={form.level} onChange={set("level")}>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Tags (comma separated)
            <input type="text" value={form.tags} onChange={set("tags")} placeholder="yoga, stretching" />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

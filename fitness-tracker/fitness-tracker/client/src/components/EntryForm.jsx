import { useState } from "react";

const CONFIG = {
  workout: { label: "Workout", placeholder: "e.g. Running", unit: "minutes", needsName: true },
  meal: { label: "Meal", placeholder: "e.g. Chicken salad", unit: "calories (kcal)", needsName: true },
  water: { label: "Water", placeholder: "", unit: "glasses", needsName: false },
  weight: { label: "Weight", placeholder: "", unit: "kg", needsName: false },
};

export default function EntryForm({ onAdd }) {
  const [type, setType] = useState("workout");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const cfg = CONFIG[type];

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!value || Number(value) <= 0) {
      setError("Please enter a value greater than 0");
      return;
    }
    setBusy(true);
    try {
      await onAdd({ type, name, value: Number(value) });
      setName("");
      setValue("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add entry</h2>

      <div className="tabs">
        {Object.entries(CONFIG).map(([key, c]) => (
          <button
            type="button"
            key={key}
            className={"tab" + (type === key ? " active" : "")}
            onClick={() => setType(key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {cfg.needsName && (
        <label>
          Name
          <input
            type="text"
            value={name}
            placeholder={cfg.placeholder}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      )}

      <label>
        Amount ({cfg.unit})
        <input
          type="number"
          step="any"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button className="btn" disabled={busy}>
        {busy ? "Saving..." : "+ Add"}
      </button>
    </form>
  );
}

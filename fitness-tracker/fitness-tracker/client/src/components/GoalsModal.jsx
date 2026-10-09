import { useState } from "react";

export default function GoalsModal({ goals, onSave, onClose }) {
  const [form, setForm] = useState(goals);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        calories: Number(form.calories),
        water: Number(form.water),
        workoutMinutes: Number(form.workoutMinutes),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Daily goals</h2>
        <label>
          Calories (kcal)
          <input type="number" value={form.calories} onChange={set("calories")} />
        </label>
        <label>
          Workout (minutes)
          <input type="number" value={form.workoutMinutes} onChange={set("workoutMinutes")} />
        </label>
        <label>
          Water (glasses)
          <input type="number" value={form.water} onChange={set("water")} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn">Save</button>
        </div>
      </form>
    </div>
  );
}

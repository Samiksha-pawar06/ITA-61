import { useState } from "react";
import { CATEGORIES } from "../utils.js";

export default function ExpenseForm({ defaultDate, onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(defaultDate);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const value = Math.round(parseFloat(amount) * 100) / 100;
    if (!(value > 0)) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }

    onAdd({
      id: "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      amount: value,
      category,
      date,
      note: note.trim(),
    });

    setAmount("");
    setNote("");
    setError("");
  }

  return (
    <section className="panel" aria-label="Add expense">
      <h2>Add expense</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount (₹)
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Note
          <input
            type="text"
            placeholder="Optional"
            maxLength={80}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <div className="actions">
          <button className="primary" type="submit">
            Add expense
          </button>
          {error && (
            <span className="err" role="alert">
              {error}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

const ICONS = { workout: "🏃", meal: "🍽️", water: "💧", weight: "⚖️" };
const UNITS = { workout: "min", meal: "kcal", water: "glasses", weight: "kg" };

export default function EntryList({ entries, onDelete }) {
  return (
    <div className="card">
      <h2>Today's log</h2>
      {entries.length === 0 ? (
        <p className="empty">Nothing logged for this day yet.</p>
      ) : (
        <ul className="entry-list">
          {entries.map((e) => (
            <li key={e.id} className="entry">
              <span className="entry-icon">{ICONS[e.type]}</span>
              <div className="entry-info">
                <strong>{e.name}</strong>
                <span className="entry-type">{e.type}</span>
              </div>
              <span className="entry-value">
                {e.value} {UNITS[e.type]}
              </span>
              <button
                className="icon-btn"
                title="Delete"
                onClick={() => onDelete(e.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

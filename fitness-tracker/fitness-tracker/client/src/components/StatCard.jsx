export default function StatCard({ icon, label, value, unit, goal, color }) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div className="card stat-card">
      <div className="stat-head">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">
        {value} <small>{unit}</small>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: pct + "%", background: color }} />
      </div>
      <div className="stat-goal">
        {pct}% of {goal} {unit} goal
      </div>
    </div>
  );
}

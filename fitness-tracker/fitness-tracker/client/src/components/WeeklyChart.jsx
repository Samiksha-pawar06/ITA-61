import { useState } from "react";

const METRICS = {
  calories: { label: "Calories", unit: "kcal", color: "#f97316", goalKey: "calories" },
  workoutMinutes: { label: "Workout", unit: "min", color: "#22c55e", goalKey: "workoutMinutes" },
  water: { label: "Water", unit: "glasses", color: "#3b82f6", goalKey: "water" },
};

const dayName = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });

export default function WeeklyChart({ data, goals }) {
  const [metric, setMetric] = useState("calories");
  const m = METRICS[metric];
  const goal = goals[m.goalKey];
  const max = Math.max(goal, ...data.map((d) => d[metric]), 1);

  return (
    <div className="card">
      <h2>Last 7 days</h2>
      <div className="tabs">
        {Object.entries(METRICS).map(([key, c]) => (
          <button
            key={key}
            className={"tab" + (metric === key ? " active" : "")}
            onClick={() => setMetric(key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="chart">
        <div className="goal-line" style={{ bottom: (goal / max) * 100 + "%" }}>
          <span>goal {goal}</span>
        </div>
        {data.map((d) => (
          <div className="bar-col" key={d.date}>
            <span className="bar-value">{d[metric] || ""}</span>
            <div
              className="bar"
              title={`${d.date}: ${d[metric]} ${m.unit}`}
              style={{ height: (d[metric] / max) * 100 + "%", background: m.color }}
            />
            <span className="bar-label">{dayName(d.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

function category(bmi) {
  if (bmi < 18.5) return { text: "Underweight", color: "#3b82f6" };
  if (bmi < 25) return { text: "Normal", color: "#22c55e" };
  if (bmi < 30) return { text: "Overweight", color: "#f59e0b" };
  return { text: "Obese", color: "#ef4444" };
}

export default function BMICard({ latestWeight }) {
  const [height, setHeight] = useState(() => localStorage.getItem("height") || "");

  const onChange = (e) => {
    setHeight(e.target.value);
    localStorage.setItem("height", e.target.value);
  };

  const h = Number(height) / 100;
  const bmi = latestWeight && h > 0 ? latestWeight.value / (h * h) : null;
  const cat = bmi ? category(bmi) : null;

  return (
    <div className="card">
      <h2>BMI calculator</h2>
      <label>
        Your height (cm)
        <input type="number" value={height} onChange={onChange} placeholder="e.g. 170" />
      </label>

      {!latestWeight ? (
        <p className="empty">Log your weight to see your BMI.</p>
      ) : !bmi ? (
        <p className="empty">Enter your height to calculate.</p>
      ) : (
        <div className="bmi-result">
          <div className="bmi-number" style={{ color: cat.color }}>
            {bmi.toFixed(1)}
          </div>
          <div>
            <strong style={{ color: cat.color }}>{cat.text}</strong>
            <p className="muted">
              Based on {latestWeight.value} kg ({latestWeight.date})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

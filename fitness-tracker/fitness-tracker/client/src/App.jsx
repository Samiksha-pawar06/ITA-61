import { useEffect, useState, useCallback } from "react";
import { api } from "./api.js";
import StatCard from "./components/StatCard.jsx";
import EntryForm from "./components/EntryForm.jsx";
import EntryList from "./components/EntryList.jsx";
import WeeklyChart from "./components/WeeklyChart.jsx";
import BMICard from "./components/BMICard.jsx";
import GoalsModal from "./components/GoalsModal.jsx";

const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export default function App() {
  const [date, setDate] = useState(todayStr());
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, water: 8, workoutMinutes: 30 });
  const [latestWeight, setLatestWeight] = useState(null);
  const [showGoals, setShowGoals] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [e, s, g, w] = await Promise.all([
        api.getEntries(date),
        api.getSummary(date, 7),
        api.getGoals(),
        api.getLatestWeight(),
      ]);
      setEntries(e);
      setSummary(s);
      setGoals(g);
      setLatestWeight(w);
      setError("");
    } catch (err) {
      setError("Cannot reach the server. Is the backend running on port 5000?");
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (entry) => {
    await api.addEntry({ ...entry, date });
    await load();
  };

  const handleDelete = async (id) => {
    await api.deleteEntry(id);
    await load();
  };

  const handleSaveGoals = async (g) => {
    await api.saveGoals(g);
    setShowGoals(false);
    await load();
  };

  const today = summary.find((d) => d.date === date) || {
    calories: 0,
    workoutMinutes: 0,
    water: 0,
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>💪 FitTrack</h1>
          <p className="subtitle">Your daily health &amp; fitness tracker</p>
        </div>
        <div className="topbar-actions">
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn secondary" onClick={() => setShowGoals(true)}>
            ⚙ Goals
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="stats-grid">
        <StatCard
          icon="🔥"
          label="Calories eaten"
          value={today.calories}
          unit="kcal"
          goal={goals.calories}
          color="#f97316"
        />
        <StatCard
          icon="🏃"
          label="Workout"
          value={today.workoutMinutes}
          unit="min"
          goal={goals.workoutMinutes}
          color="#22c55e"
        />
        <StatCard
          icon="💧"
          label="Water"
          value={today.water}
          unit="glasses"
          goal={goals.water}
          color="#3b82f6"
        />
      </section>

      <main className="layout">
        <div className="col">
          <EntryForm onAdd={handleAdd} />
          <EntryList entries={entries} onDelete={handleDelete} />
        </div>
        <div className="col">
          <WeeklyChart data={summary} goals={goals} />
          <BMICard latestWeight={latestWeight} />
        </div>
      </main>

      <footer className="footer">Built with React + Express · Stay consistent! 🌱</footer>

      {showGoals && (
        <GoalsModal goals={goals} onSave={handleSaveGoals} onClose={() => setShowGoals(false)} />
      )}
    </div>
  );
}

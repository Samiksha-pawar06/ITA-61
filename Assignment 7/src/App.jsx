import { useEffect, useMemo, useState } from "react";
import ExpenseForm from "./components/ExpenseForm.jsx";
import Summary from "./components/Summary.jsx";
import CategoryBreakdown from "./components/CategoryBreakdown.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import {
  loadExpenses,
  saveExpenses,
  sampleExpenses,
  toDateString,
  monthLabel,
  shiftMonth,
  daysInMonth,
} from "./utils.js";

export default function App() {
  const today = toDateString(new Date());
  const [expenses, setExpenses] = useState(loadExpenses);
  const [month, setMonth] = useState(today.slice(0, 7)); // "YYYY-MM"

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const showingSamples = expenses.length === 0;
  const all = useMemo(
    () => (showingSamples ? sampleExpenses() : expenses),
    [showingSamples, expenses]
  );

  const stats = useMemo(() => {
    const inMonth = all
      .filter((e) => e.date.slice(0, 7) === month)
      .sort((a, b) => b.date.localeCompare(a.date));

    const total = inMonth.reduce((sum, e) => sum + e.amount, 0);

    const byCategory = {};
    inMonth.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

    const prevMonth = shiftMonth(month, -1);
    const prevTotal = all
      .filter((e) => e.date.slice(0, 7) === prevMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    const isCurrentMonth = month === today.slice(0, 7);
    const days = isCurrentMonth ? new Date().getDate() : daysInMonth(month);

    return { inMonth, total, categories, prevMonth, prevTotal, perDay: total / days };
  }, [all, month, today]);

  function addExpense(expense) {
    setExpenses([expense, ...expenses]);
    setMonth(expense.date.slice(0, 7)); 
  }

  function deleteExpense(id) {
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  return (
    <main className="app">
      <header className="top">
        <h1>Expense Ledger</h1>
        <div className="months">
          <button
            className="icon-btn"
            aria-label="Previous month"
            onClick={() => setMonth(shiftMonth(month, -1))}
          >
            ‹
          </button>
          <span>{monthLabel(month)}</span>
          <button
            className="icon-btn"
            aria-label="Next month"
            onClick={() => setMonth(shiftMonth(month, 1))}
          >
            ›
          </button>
        </div>
      </header>

      {showingSamples && (
        <p className="banner">
          These are example entries. Add your first expense below and they will
          be replaced by your own.
        </p>
      )}

      <Summary
        month={month}
        total={stats.total}
        count={stats.inMonth.length}
        perDay={stats.perDay}
        prevMonth={stats.prevMonth}
        prevTotal={stats.prevTotal}
      />
      <ExpenseForm defaultDate={today} onAdd={addExpense} />
      <CategoryBreakdown
        month={month}
        categories={stats.categories}
        total={stats.total}
      />
      <ExpenseList
        month={month}
        expenses={stats.inMonth}
        onDelete={deleteExpense}
      />

      <p className="meta">Entries are saved in this browser on this device.</p>
    </main>
  );
}

import { money, monthName } from "../utils.js";

export default function Summary({ month, total, count, perDay, prevMonth, prevTotal }) {
  let change = null;
  if (prevTotal > 0) {
    const pct = Math.round(((total - prevTotal) / prevTotal) * 100);
    if (pct === 0) {
      change = <span>Same as {monthName(prevMonth)}</span>;
    } else {
      change = (
        <span className={pct > 0 ? "up" : "down"}>
          {pct > 0 ? "▲" : "▼"} {Math.abs(pct)}% {pct > 0 ? "more" : "less"} than{" "}
          {monthName(prevMonth)}
        </span>
      );
    }
  }

  return (
    <section className="panel" aria-label="Summary">
      <h2>Spent in {monthName(month)}</h2>
      <div className="total">{money(total)}</div>
      <div className="sub">
        <span>
          {count} {count === 1 ? "expense" : "expenses"}
        </span>
        <span>{money(Math.round(perDay))} per day</span>
        {change}
      </div>
    </section>
  );
}

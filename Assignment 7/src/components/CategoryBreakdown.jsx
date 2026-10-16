import { money, monthName } from "../utils.js";

export default function CategoryBreakdown({ month, categories, total }) {
  const largest = categories.length ? categories[0][1] : 1;

  return (
    <section className="panel" aria-label="By category">
      <h2>By category</h2>
      {categories.length === 0 ? (
        <p className="empty">Nothing spent in {monthName(month)} yet.</p>
      ) : (
        categories.map(([name, amount]) => (
          <div className="cat-row" key={name} title={`${name}: ${money(amount)}`}>
            <span className="name">{name}</span>
            <div className="track">
              <div
                className="bar"
                style={{ width: Math.max(2, (amount / largest) * 100) + "%" }}
              />
            </div>
            <span className="num">
              {money(amount)}
              <span className="pct">{Math.round((amount / total) * 100)}%</span>
            </span>
          </div>
        ))
      )}
    </section>
  );
}

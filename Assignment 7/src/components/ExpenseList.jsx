import { useState } from "react";
import { money, monthLabel } from "../utils.js";

export default function ExpenseList({ month, expenses, onDelete }) {
  // Deleting takes two clicks so an expense is not removed by accident.
  const [confirmId, setConfirmId] = useState(null);

  return (
    <section className="panel" aria-label="Expenses">
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p className="empty">No expenses in {monthLabel(month)}.</p>
      ) : (
        <ul>
          {expenses.map((e) => {
            const date = new Date(e.date + "T00:00:00");
            return (
              <li className="row" key={e.id}>
                <div className="day">
                  <b>{date.getDate()}</b>
                  {date.toLocaleDateString("en-IN", { weekday: "short" })}
                </div>

                <div className="what">
                  <div>{e.note || e.category}</div>
                  {e.note && <div className="meta">{e.category}</div>}

                  {!e.sample &&
                    (confirmId === e.id ? (
                      <span>
                        <button
                          className="link danger"
                          onClick={() => {
                            onDelete(e.id);
                            setConfirmId(null);
                          }}
                        >
                          Confirm delete
                        </button>{" "}
                        <button className="link" onClick={() => setConfirmId(null)}>
                          Keep
                        </button>
                      </span>
                    ) : (
                      <button className="link" onClick={() => setConfirmId(e.id)}>
                        Delete
                      </button>
                    ))}
                </div>

                <div className="amt">{money(e.amount)}</div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

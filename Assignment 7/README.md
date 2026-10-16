# Expense Ledger

A small React app to record personal expenses and see where the money goes.

## Features

- Add an expense with amount, date, category and an optional note
- Browse month by month with the arrow buttons
- Monthly summary: total spent, average per day, and change from the previous month
- Spending by category, shown as bars with the share of the month's total
- Delete an expense (asks for a second click to confirm)
- Data is saved in the browser (`localStorage`), so it is still there after a refresh
- Example entries are shown until the first real expense is added

## Run it

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the address printed in the terminal (usually http://localhost:5173).

To make a production build: `npm run build`

## Project structure

```
src/
  main.jsx                    entry point
  App.jsx                     state, monthly calculations, page layout
  utils.js                    categories, money/date helpers, localStorage, sample data
  index.css                   all styles (light and dark)
  components/
    Summary.jsx               total, per-day average, change vs last month
    ExpenseForm.jsx           the add-expense form with validation
    CategoryBreakdown.jsx     category bars
    ExpenseList.jsx           list of expenses for the month, with delete
```

## How it works

`App` keeps the list of expenses in state and writes it to `localStorage` whenever it
changes. For the selected month it works out the total, the per-category totals and the
previous month's total once (`useMemo`), then passes the results to the display
components. Each component does one job and gets what it needs through props.

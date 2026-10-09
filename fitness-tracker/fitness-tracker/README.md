# 💪 FitTrack – Health & Fitness Tracker (Full-Stack Mini Project)

A full-stack app to log workouts, meals, water and weight, track daily goals,
see a 7-day chart and calculate BMI.

**Tech stack**
- Frontend: HTML, CSS, React (Vite)
- Backend: Node.js + Express (REST API)
- Database: JSON file (`server/data.json`, created automatically)

## Folder structure

```
fitness-tracker/
├── server/              # Express backend
│   ├── index.js         # API routes
│   └── package.json
└── client/              # React frontend
    ├── index.html
    ├── vite.config.js   # proxies /api -> localhost:5000
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        ├── index.css
        └── components/
```

## How to run (VS Code)

You need Node.js 18+ installed. Open the `fitness-tracker` folder in VS Code,
then open **two terminals** (Terminal → New Terminal, and the split icon).

**Terminal 1 – backend**
```bash
cd server
npm install
npm start
```
You should see: `Fitness API running on http://localhost:5000`

**Terminal 2 – frontend**
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173 in your browser.

## API endpoints

| Method | URL                    | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | /api/entries?date=     | Entries for a date                   |
| POST   | /api/entries           | Add `{type,name,value,date}`         |
| DELETE | /api/entries/:id       | Delete an entry                      |
| GET    | /api/summary?end=&days=| Daily totals for last N days         |
| GET    | /api/goals             | Get daily goals                      |
| PUT    | /api/goals             | Update goals                         |
| GET    | /api/weight/latest     | Most recent weight entry             |

`type` is one of `workout` (minutes), `meal` (kcal), `water` (glasses), `weight` (kg).

## Ideas to extend it

- User login (JWT) so each person has their own data
- Replace the JSON file with MongoDB or SQLite
- Weight-over-time line chart
- Calorie-burn estimates per exercise

# 💪 FitTrack – Health & Fitness Tracker (Full-Stack Mini Project)

Log workouts, meals, water and weight, track daily goals, see a 7-day chart, calculate BMI,
and search a **Health Library** of videos, articles, tips and recipes.

**Tech stack**
- Frontend: HTML, CSS, React (Vite)
- Backend: Node.js + Express 5 (REST API)
- Database: **MongoDB** (via Mongoose)

## Folder structure

```
fitness-tracker/
├── server/
│   ├── index.js            # starts Express + connects to MongoDB
│   ├── .env.example        # copy to .env and set MONGO_URI
│   ├── seed.js / seedData.js   # starter Health Library content
│   ├── models/             # Entry, Goal, Resource (MongoDB schemas)
│   ├── routes/             # tracker.js (entries, goals, summary), resources.js (library + search)
│   └── utils/search.js     # builds the search filter
└── client/
    ├── vite.config.js      # proxies /api -> localhost:5000
    └── src/
        ├── App.jsx         # Dashboard / Health Library tabs
        ├── api.js          # all backend calls
        ├── youtube.js      # reads YouTube links (thumbnail + player)
        └── components/     # StatCard, EntryForm, Library, ResourceCard, ...
```

## Step 1 – Set up MongoDB (choose ONE option)

### Option A: MongoDB Atlas (free cloud database – easiest, works on any computer)
1. Go to https://www.mongodb.com/atlas and create a free account.
2. Create a **free (M0) cluster**.
3. **Database Access** → Add Database User → choose a username and password (remember them).
4. **Network Access** → Add IP Address → "Allow access from anywhere" (0.0.0.0/0) for a student project.
5. **Database** → Connect → Drivers → copy the connection string. It looks like
   `mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
6. In `server/`, copy `.env.example` to `.env` and set:
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/fittrack?retryWrites=true&w=majority
   ```
   (Replace user, password and cluster address with yours. Add `/fittrack` before the `?` – that is the database name.
   If your password has special characters like `@` or `#`, URL-encode them.)

### Option B: MongoDB installed on your computer
1. Install **MongoDB Community Server** from https://www.mongodb.com/try/download/community
   (optionally also **MongoDB Compass**, a visual tool to see your data).
2. Make sure the MongoDB service is running.
3. In `server/`, copy `.env.example` to `.env`. The default already works:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/fittrack
   ```

## Step 2 – Run the project (two terminals, server first)

**Terminal 1 – backend**
```bash
cd server
cp .env.example .env        # Windows PowerShell: copy .env.example .env
npm install
npm start
```
You should see:
```
Connected to MongoDB
Seeded 28 health library items
Fitness API running on http://localhost:5000
```

**Terminal 2 – frontend**
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

## Features

**Dashboard**: add/delete workouts, meals, water, weight; daily goals; weekly chart; BMI.

**Health Library** (search page):
- Search box with partial words ("yog" finds yoga); several words must all match
- Filter by type (video / article / tip / recipe) and category (workout, yoga, nutrition, sleep ...)
- ★ Favourites, pagination, clear-filters button
- Add your own resources; paste a **YouTube link** and it plays inside the app
- Built-in videos open a YouTube search for the topic (so links never break)

## API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/health | Server + database status |
| GET | /api/entries?date= | Entries for a date |
| POST | /api/entries | Add `{type,name,value,date}` |
| DELETE | /api/entries/:id | Delete an entry |
| GET | /api/summary?end=&days= | Daily totals for last N days |
| GET / PUT | /api/goals | Read / update daily goals |
| GET | /api/weight/latest | Most recent weight |
| GET | /api/resources?q=&type=&category=&favorites=&page=&limit= | **Search the Health Library** |
| GET | /api/resources/meta | Counts for filters |
| POST | /api/resources | Add your own resource |
| PATCH | /api/resources/:id/favorite | Toggle favourite |
| DELETE | /api/resources/:id | Delete a resource |

Try it in the browser: http://localhost:5000/api/resources?q=yoga

## How the search works (for your viva)
The search box text is split into words. For each word the server builds a case-insensitive
regular expression and checks the `title`, `description`, `tags`, `body` and `source` fields in MongoDB.
All words must match (AND). Special characters are escaped so users cannot break the query.
Filters (`type`, `category`, `favorite`) are added to the same MongoDB query, and results are paginated
with `skip` and `limit`. A MongoDB **text index** is also defined on the Resource model.
The frontend waits 300 ms after typing stops (debounce) before calling the API.

## Troubleshooting
- **`Could not connect to MongoDB`** → check `MONGO_URI` in `server/.env`; for Atlas check the username/password
  and that your IP is allowed in Network Access; for a local install check the MongoDB service is running.
- **"Cannot reach the server" banner** → the backend is not running (check terminal 1).
- **`vite: Permission denied` on Linux** → run `chmod -R +x node_modules/.bin` inside `client`, or use
  `node node_modules/vite/bin/vite.js`.
- To reset the built-in library items: `npm run seed` (inside `server`). Your own items are kept.

## Ideas to extend it
- User login (JWT) so each person has their own data
- Weight-over-time line chart, sleep tracking, streaks and badges
- Fetch real videos with the YouTube Data API

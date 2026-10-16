require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { seedIfEmpty } = require("./seed");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fittrack";

app.use(cors());
app.use(express.json());

// (Express 5 automatically passes errors from async routes to the error handler below.)

app.get("/api/health", (req, res) => {
  // readyState 1 = connected to MongoDB
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "not connected" });
});

app.use("/api", require("./routes/tracker"));
app.use("/api/resources", require("./routes/resources"));

// Final error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Something went wrong on the server" });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("Connected to MongoDB");
    await seedIfEmpty();
    app.listen(PORT, () => console.log("Fitness API running on http://localhost:" + PORT));
  } catch (err) {
    console.error("\nCould not connect to MongoDB:", err.message);
    console.error("Check MONGO_URI in server/.env and that MongoDB is running (see README).\n");
    process.exit(1);
  }
}

start();

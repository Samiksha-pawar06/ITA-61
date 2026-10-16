// Fills the Health Library with starter content.
//  - Runs automatically when the server starts if the library is empty.
//  - Run "npm run seed" to wipe the built-in items and re-add them (your own items are kept).
const Resource = require("./models/Resource");
const seedData = require("./seedData");

async function seedIfEmpty() {
  const count = await Resource.countDocuments();
  if (count === 0) {
    await Resource.insertMany(seedData);
    console.log(`Seeded ${seedData.length} health library items`);
  }
}

async function reseed() {
  await Resource.deleteMany({ custom: false });
  await Resource.insertMany(seedData);
  console.log(`Re-seeded ${seedData.length} built-in items (custom items kept)`);
}

module.exports = { seedIfEmpty, reseed };

if (require.main === module) {
  require("dotenv").config();
  const mongoose = require("mongoose");
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fittrack")
    .then(reseed)
    .then(() => mongoose.disconnect())
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}

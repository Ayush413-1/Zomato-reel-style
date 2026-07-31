require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

let isConnected = false;

async function startDatabase() {
  if (isConnected) return;

  await connectDB();
  isConnected = true;
  console.log("MongoDB connected");
}

if (process.env.NODE_ENV !== "production") {
  startDatabase().catch((err) => {
    console.log("MongoDB connection error:", err);
  });
}

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = async (req, res) => {
  await startDatabase();
  return app(req, res);
};
  
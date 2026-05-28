import * as dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes";
import transactionRoutes from "./routes/transactionRoutes";

// CRON
import "./utils/cron";

// 🔥 DEBUG (remove later)
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/events", eventRoutes);
app.use("/transactions", transactionRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// GLOBAL ERROR HANDLER
app.use((err: any, req: any, res: any, next: any) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
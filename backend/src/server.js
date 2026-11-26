import leadRoutes from "./routes/leadRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import "dotenv/config";
import appointmentRoutes from "./routes/appointmentRoutes.js";


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/leads", leadRoutes);
app.use("/api/chat", aiRoutes);
app.use("/api/appointments", appointmentRoutes);
// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fortivex AI Sales Agent Backend is running!"
  });
});

const PORT = process.env.PORT || 5002;

// Start application
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

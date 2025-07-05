const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/auto-klub";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// Import routes
const carRoutes = require("./routes/cars");
const uploadRoutes = require("./routes/upload");

// Use routes
app.use("/api/cars", carRoutes);
app.use("/api/upload", uploadRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Auto Klub API je aktivan! 🚗",
    version: "1.0.0",
    endpoints: {
      cars: "/api/cars",
      carsById: "/api/cars/:id",
      upload: "/api/upload",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Nešto je pošlo naopako!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta nije pronađena" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server je pokrenut na portu ${PORT}`);
  console.log(`📡 API dostupan na: http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:3000`);
});

module.exports = app;

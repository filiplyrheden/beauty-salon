// server.js
import express from "express";
import cors from "cors";
import { showProducts } from "./controllers/product.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Routes
app.get("/products", showProducts);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Handle Unhandled Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, exit the process or perform other cleanup
  // process.exit(1);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

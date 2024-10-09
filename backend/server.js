// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import upload from "./config/uploadConfig.js";
import {
  showProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./controllers/product.js";
import {
  showCourses,
  createNewCourse,
  updateCourseById,
  deleteCourseById,
} from "./controllers/course.js";
import dotenv from "dotenv";
import multer from "multer"; // <-- Import multer

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Handle __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirnameFull = dirname(__filename);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirnameFull, "uploads")));

// Routes
app.get("/products", showProducts);
app.get("/admin/products", showProducts);
app.post("/admin/createproducts", createProduct);
app.put("/admin/createproducts", updateProduct);
app.delete("/admin/createproducts/:id", deleteProduct);
app.get("/courses", showCourses);

// CRUD Routes for Courses with Image Upload
app.post("/courses", upload.single("image"), createNewCourse); // Create
app.put("/courses/:id", upload.single("image"), updateCourseById); // Update
app.delete("/courses/:id", deleteCourseById); // Delete

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Express Error:", err.message);
  if (err instanceof multer.MulterError) {
    // Now multer is defined
    // Handle Multer-specific errors
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Handle general errors
    return res.status(500).json({ error: err.message });
  }
  next();
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

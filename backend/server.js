import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import upload from "./config/uploadConfig.js"; // Import multer configuration
import {
  showCourses,
  createNewCourse,
  updateCourseById,
  deleteCourseById,
} from "./controllers/course.js"; // Import additional controller functions

import { showProducts, createProduct, updateProduct, deleteProduct } from "./controllers/product.js";


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Handle __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirnameFull = dirname(__filename);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirnameFull, "uploads")));

// Routes
app.get("/products", showProducts);
app.get("/courses", showCourses);

// CRUD Routes for Courses with Image Upload
app.post("/courses", upload.single("image"), createNewCourse); // Create
app.put("/courses/:id", upload.single("image"), updateCourseById); // Update
app.delete("/courses/:id", deleteCourseById); // Delete

app.get("/admin/products", showProducts);
app.post("/admin/createproducts", createProduct);
app.put("/admin/createproducts", updateProduct);
app.delete("/admin/createproducts/:id", deleteProduct);


// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Express Error:", err.message);
  if (err instanceof multer.MulterError) {
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
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

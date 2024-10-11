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
import {
  showServices,
  createNewService,
  updateServiceById,
  deleteServiceById,
} from "./controllers/service.js";
import {
  showServicesCategories,
  createNewServicesCategories,
  updateServicesCategoriesById,
  deleteServicesCategoriesById,
} from "./controllers/servicescategories.js";
import {
  showPageReviews,
  createNewPageReviews,
  updatePageReviewsById,
  deletePageReviewsById,
} from "./controllers/pagereview.js";
import dotenv from "dotenv";
import multer from "multer"; // <-- Import multer
import {
  showUserById,
  updateUserById,
  createNewUser,
  deleteUserById,
} from "./controllers/user.js";

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

// Routes for Products
app.get("/products", showProducts); // Get all products
app.get("/admin/products", showProducts); // Get all products for admin
app.post("/admin/products", createProduct); // Create a new product
app.put("/admin/products", updateProduct); // Update a product
app.delete("/admin/products/:id", deleteProduct); // Delete a product

// Routes for Courses
app.get("/courses", showCourses); // Get all courses
app.post("/courses", upload.single("image"), createNewCourse); // Create a new course with image upload
app.put("/courses/:id", upload.single("image"), updateCourseById); // Update a course with image upload
app.delete("/courses/:id", deleteCourseById); // Delete a course

// Routes for Services
app.get("/services", showServices); // Get all courses
app.post(
  "/services",
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  createNewService
);
app.put(
  "/services/:id",
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  updateServiceById
);
app.delete("/services/:id", deleteServiceById); // Delete a service

//Routes for ServicesCategories
app.get("/services-categories", showServicesCategories); // Get all Servicescategories
app.post("/services-categories", createNewServicesCategories); // Create
app.put("/services-categories/:id", updateServicesCategoriesById); // Update
app.delete("/services-categories/:id", deleteServicesCategoriesById); // Delete

//Routes for PageReviews
app.get("/page-reviews", showPageReviews); // Get all PageReviews
app.post("/page-reviews", createNewPageReviews); // Create
app.put("/page-reviews/:id", updatePageReviewsById); // Update
app.delete("/page-reviews/:id", deletePageReviewsById); // Delete

//Routes for User

app.get("/user/:id", showUserById); // Get all User
app.post("/user", createNewUser); // Create
app.put("/user/:id", updateUserById); // Update
app.delete("/user/:id", deleteUserById); // Delete
// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Express Error:", err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
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

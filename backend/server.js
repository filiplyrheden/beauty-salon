// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import upload from "./config/uploadConfig.js";
import adminMiddleware from "./middleware/adminMiddleware.js";
import authMiddleware from "./middleware/authMiddleware.js";
import {
  showEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./controllers/event.js";
import {
  GetProductById,
  showProducts,
  showallProducts,
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
import {
  showProductReviews,
  showProductReviewsById,
  deleteProductReviewsById,
  updateProductReviewById,
} from "./controllers/productreview.js";
import dotenv from "dotenv";
import multer from "multer"; // <-- Import multer
import {
  showUserById,
  updateUserById,
  createNewUser,
  deleteUserById,
} from "./controllers/user.js";
import {
  showCategories,
  deleteCategoriesById,
  updateCategoriesById,
  createNewCategories,
} from "./controllers/categories.js";

import { loginUser, registerUser } from "./controllers/authentication.js";
import {
  createNewOrder,
  deleteOrderById,
  showOrders,
  updateOrderById,
} from "./controllers/order.js";

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());

// Handle __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirnameFull = dirname(__filename);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirnameFull, "uploads")));

// Routes for Products
app.get("/products", showProducts); // Get all products
app.get("/allproducts", showallProducts); // Get all products with additional info
app.get("/admin/products", authMiddleware, adminMiddleware, showProducts); // Get all products for admin
app.post("/admin/products", authMiddleware, adminMiddleware, createProduct); // Create a new product
app.put("/admin/products", authMiddleware, adminMiddleware, updateProduct); // Update a product
app.delete(
  "/admin/products/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
); // Delete a product

app.get("/categories", showCategories); // Get all product Categories
app.post("/categories", authMiddleware, adminMiddleware, createNewCategories); // Create
app.put(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoriesById
); // Update
app.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategoriesById
); // Delete

// Routes for Courses
app.get("/courses", showCourses); // Get all courses
app.post(
  "/courses",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createNewCourse
); // Create a new course with image upload
app.put(
  "/courses/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateCourseById
); // Update a course with image upload
app.delete("/courses/:id", authMiddleware, adminMiddleware, deleteCourseById); // Delete a course

// Routes for events with image upload
app.get("/admin/events", authMiddleware, adminMiddleware, showEvents);
app.post(
  "/admin/events",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createEvent
); // Added image upload to events
app.put(
  "/admin/events/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateEvent
); // Added image upload to events
app.delete("/admin/events/:id", authMiddleware, adminMiddleware, deleteEvent);

app.get("/orders", authMiddleware, adminMiddleware, showOrders); // Get all the orders
app.post("/orders", authMiddleware, adminMiddleware, createNewOrder); // Create orders
app.put("/orders/:id", authMiddleware, adminMiddleware, updateOrderById); // update a specific order
app.delete("/orders/:id", authMiddleware, adminMiddleware, deleteOrderById); // delete a specific order

// Auth Routes
app.post("/login", loginUser);
app.post("/register", registerUser);

// Routes for Services
app.get("/services", authMiddleware, adminMiddleware, showServices); // Get all courses
app.post(
  "/services",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  createNewService
);
app.put(
  "/services/:id",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  updateServiceById
);
app.delete("/services/:id", authMiddleware, adminMiddleware, deleteServiceById); // Delete a service

//Routes for ServicesCategories
app.get(
  "/services-categories",
  authMiddleware,
  adminMiddleware,
  showServicesCategories
); // Get all Servicescategories
app.post(
  "/services-categories",
  authMiddleware,
  adminMiddleware,
  createNewServicesCategories
); // Create
app.put(
  "/services-categories/:id",
  authMiddleware,
  adminMiddleware,
  updateServicesCategoriesById
); // Update
app.delete(
  "/services-categories/:id",
  authMiddleware,
  adminMiddleware,
  deleteServicesCategoriesById
); // Delete

//Routes for PageReviews
app.get("/page-reviews", authMiddleware, adminMiddleware, showPageReviews); // Get all PageReviews
app.post(
  "/page-reviews",
  authMiddleware,
  adminMiddleware,
  createNewPageReviews
); // Create
app.put(
  "/page-reviews/:id",
  authMiddleware,
  adminMiddleware,
  updatePageReviewsById
); // Update
app.delete(
  "/page-reviews/:id",
  authMiddleware,
  adminMiddleware,
  deletePageReviewsById
); // Delete

//Routes for ProductReviews
app.get(
  "/product-reviews",
  authMiddleware,
  adminMiddleware,
  showProductReviews
); // Get all ProductReviews
app.put(
  "/product-reviews/:id",
  authMiddleware,
  adminMiddleware,
  updateProductReviewById
);
app.delete(
  "/product-reviews/:id",
  authMiddleware,
  adminMiddleware,
  deleteProductReviewsById
);

//Routes for User
app.get("/user/:id", showUserById); // Get all User
app.post("/user", createNewUser); // Create
app.put("/user/:id", authMiddleware, adminMiddleware, updateUserById); // Update
app.delete("/user/:id", authMiddleware, adminMiddleware, deleteUserById); // Delete

// Routes for singular Product
app.get("/product/:id", GetProductById);

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

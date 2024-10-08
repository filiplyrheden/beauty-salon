import express from "express";
import cors from "cors";
import { showProducts, createProduct, updateProduct, deleteProduct } from "./controllers/product.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/products", showProducts);
app.get("/admin/products", showProducts);
app.post("/admin/createproducts", createProduct);
app.put("/admin/createproducts", updateProduct);
app.delete("/admin/createproducts/:id", deleteProduct);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Handle Unhandled Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

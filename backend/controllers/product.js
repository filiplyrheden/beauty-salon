import {
  getProducts,
  insertProduct,
  editProduct,
  trashProduct,
  getProductById,
  getProductsWithInfo,
} from "../models/ProductModel.js";
import { getCategoriesById } from "../models/productCategoriesModel.js";

/**
 * Handler to show all products.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const showProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in showProducts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const showallProducts = async (req, res) => {
  try {
    const products = await getProductsWithInfo();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in showProductsWithInfo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to insert a new product.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const createProduct = async (req, res) => {
  const product = req.body; // Get product details from the request body

  try {
    const result = await insertProduct(product);
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.error("Error in createProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to update an existing product.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const updateProduct = async (req, res) => {
  const product = req.body; // Get product details from the request body

  try {
    const result = await editProduct(product);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error in updateProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to delete a product from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const deleteProduct = async (req, res) => {
  const productId = req.params.id; // Get product ID from request parameters
  console.log("productId inside controller: " + productId);

  try {
    const result = await trashProduct(productId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error in deleteProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to delete a product from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const GetProductById = async (req, res) => {
  console.log("hej");
  const productId = req.params.id; // Get product ID from request parameters
  console.log("productId inside controller: " + productId);

  try {
    const result = await getProductById(productId);
    if (result.Rows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ result });
  } catch (err) {
    console.error("Error in GetProuctById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

import {
  getProducts,
  insertProduct,
  editProduct,
  trashProduct,
  getProductById,
  getProductsWithInfo,
  fetchCheckoutProductsByIds,
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

export const getCheckoutProducts = async (res, dummyItems) => {
  try {
    const productIds = dummyItems.map(item => item.product_id);
    
    // Fetch product details using the product IDs
    const products = await fetchCheckoutProductsByIds(productIds);

    // Create line items with the correct quantity for each product
    const line_items = products.map((product) => {
      // Find the matching item in dummyItems to get the quantity
      const matchingItem = dummyItems.find(item => item.product_id === product.product_id);

      return {
        price_data: {
          currency: "SEK",
          product_data: {
            name: product.product_name,
            // images: [product.image], // Uncomment if needed
          },
          unit_amount: Math.round(product.price * 100), // Multiply by 100 to get the correct format
        },
        // Use the quantity from the matching item
        quantity: matchingItem ? matchingItem.quantity : 1, // Default to 1 if not found
      };
    });

    return line_items;

  } catch (err) {
    console.error("Error in getCheckoutProducts:", err);
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

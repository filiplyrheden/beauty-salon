import { getProducts } from "../models/ProductModel.js";

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

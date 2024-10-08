import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getProducts = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Products");
    return rows;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getServicesCategories = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Services_category"); // Adjust the SQL query as needed
    return rows;
  } catch (err) {
    console.error("Error fetching services:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

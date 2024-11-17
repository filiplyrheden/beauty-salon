import db from "../config/database.js";

export const getStockQuantity = async () => {
  try {
    const query = `
      SELECT 
          Products.product_id, 
          ProductSizes.size_id, 
          ProductSizes.stock_quantity AS available_quantity
      FROM 
          Products
      INNER JOIN 
          ProductSizes ON Products.product_id = ProductSizes.product_id
    `;

    // Execute the query
    const [rows] = await db.query(query);

    // Format the response to match the desired structure
    const formattedResponse = {
      items: rows.map(row => ({
        product_id: row.product_id,
        size_id: row.size_id,
        available_quantity: row.available_quantity,
      })),
    };

    return formattedResponse;
  } catch (err) {
    console.error("Error fetching product stock quantities:", err);
    throw new Error("Failed to fetch stock quantities. Please try again later.");
  }
};

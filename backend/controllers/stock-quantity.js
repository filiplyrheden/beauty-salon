// stock-quantity.js
import {
  getStockQuantity,
  /*     getStockQuantityById,
    updateStockQuantity, */
} from "../models/stock-quantityModel.js";
import pool from "../config/database.js";

export const showStockQuantity = async (req, res) => {
  try {
    const stock_quantities = await getStockQuantity();
    res.status(200).json(stock_quantities);
  } catch (err) {
    console.error("Error in showStockQuantity:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStock = async (lineItems) => {
  let connection;
  try {
    // Acquire a connection from the pool
    connection = await pool.getConnection();
    // Begin transaction
    await connection.query("BEGIN");

    // Extract product IDs, size IDs, and quantities from lineItems
    const products = lineItems.data.map((lineItem) => ({
      size_id: parseInt(lineItem.price.product.metadata.size_id),
      quantity: parseInt(lineItem.quantity),
    }));

    // Loop through each product and update stock
    for (let product of products) {
      const { size_id, quantity } = product;

      // Get the current stock for the given size
      const [currentStock] = await connection.query(
        "SELECT stock_quantity FROM ProductSizes WHERE size_id = ?",
        [size_id]
      );

      if (!currentStock) {
        throw new Error(`No stock found for size_id: ${size_id}`);
      }

      const newStock = currentStock[0].stock_quantity - quantity;

      // Check if there's enough stock
      if (newStock < 0) {
        throw new Error(`Insufficient stock for size_id: ${size_id}`);
      }

      // Update stock quantity in the database
      await connection.query(
        "UPDATE ProductSizes SET stock_quantity = ? WHERE size_id = ?",
        [newStock, size_id]
      );
    }

    // Commit transaction
    await connection.query("COMMIT");
  } catch (error) {
    // If something goes wrong, rollback the transaction
    if (connection) {
      await connection.query("ROLLBACK");
    }
    console.error("Error updating stock:", error);
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
};

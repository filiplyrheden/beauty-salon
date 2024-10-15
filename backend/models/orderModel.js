import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getOrders = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Orders");
    return rows;
  } catch (err) {
    console.error("Error fetching Orders:", err);
    throw err;
  }
};

export const getOrderById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM Orders WHERE order_id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    throw err;
  }
};

// Insert a new order into the 'orders' table
export const createOrder = async (
  user_id,
  order_status,
  total_amount,
  order_date
) => {
  const query = `
      INSERT INTO Orders (user_id, order_status, total_amount, order_date)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
  const values = [user_id, order_status, total_amount, order_date];
  const { rows } = await db.query(query, values);
  return rows[0].id;
};

// Insert into 'order_details' table

export const updateOrder = async (id, orderData) => {
  const { order_status } = orderData;
  try {
    const [result] = await db.query(
      "UPDATE Orders SET order_status = ? WHERE order_id = ?",
      [order_status, id]
    );

    // Check if the order was found and updated
    if (result.affectedRows === 0) {
      return null; // No order was found with the provided ID
    }

    orderData.order_id = id; // Include the order ID in the returned data
    // In Backend's updateServicesCategories
    return { order_id: id, ...orderData };
  } catch (err) {
    console.error("Error updating Order:", err);
    throw err;
  }
};

export const deleteOrder = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    // Delete associated services
    await connection.query("DELETE FROM OrderDetails WHERE order_id = ?", [id]);
    // Delete the order
    const [result] = await connection.query(
      "DELETE FROM Orders WHERE order_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }
    await connection.commit();
    return { message: "Orders deleted successfully" };
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting Orders:", err);
    throw err;
  } finally {
    connection.release();
  }
};

// Update the total amount of an order
export const updateOrderTotalAmount = async (order_id, total_amount) => {
  const query = `
      UPDATE orders 
      SET total_amount = $1 
      WHERE id = $2
    `;
  await pool.query(query, [total_amount, order_id]);
};

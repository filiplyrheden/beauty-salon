import db from "../config/database.js";
// Fetch all order details for an order
export const fetchOrderDetails = async (order_id) => {
  const query = `SELECT * FROM orderDetails WHERE order_id = ?`;
  const { rows } = await db.query(query, [order_id]);
  return rows;
};

export const fetchSpecificOrderDetails = async (orderId) => {
  const [rows] = await db.query(
    `SELECT od.product_id, p.product_name, od.quantity, od.unit_price
    FROM OrderDetails od
    INNER JOIN Products p ON od.product_id = p.product_id
    WHERE od.order_id = ?`,
    [orderId]
  );

  return rows;
};

export const createOrderDetail = async (
  order_id,
  product_id,
  quantity,
  price,
  total_price
) => {
  const query = `
        INSERT INTO order_details (order_id, product_id, quantity, price, total_price)
        VALUES (?, ?, ?, ?, ?)
      `;
  const values = [order_id, product_id, quantity, price, total_price];
  await db.query(query, values);
};

// Update order details (e.g., quantity or price)
export const updateOrderDetail = async (
  order_id,
  product_id,
  quantity,
  total_price
) => {
  const query = `
        UPDATE order_details 
        SET quantity = ?, total_price = ?
        WHERE order_id = ? AND product_id = ?
      `;
  const values = [quantity, total_price, order_id, product_id];
  await pool.query(query, values);
};

// Remove an item from order details
export const removeOrderDetail = async (order_id, product_id) => {
  const query = `DELETE FROM order_details WHERE order_id = ? AND product_id = ?`;
  await pool.query(query, [order_id, product_id]);
};

// Add a new product to the order details
export const addOrderDetail = async (
  order_id,
  product_id,
  quantity,
  price,
  total_price
) => {
  const query = `
        INSERT INTO order_details (order_id, product_id, quantity, price, total_price)
        VALUES (?, ?, ?, ?, ?)
      `;
  const values = [order_id, product_id, quantity, price, total_price];
  await pool.query(query, values);
};

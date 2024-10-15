import db from "../config/database.js";
// Fetch all order details for an order
export const fetchOrderDetails = async (order_id) => {
  const query = `SELECT * FROM orderDetails WHERE order_id = ?`;
  const { rows } = await db.query(query, [order_id]);
  return rows;
};

export const fetchSpecificOrderDetails = async (orderId) => {
  console.log(orderId);
  const [rows] = await db.query(
    `SELECT od.product_id, p.product_name, od.quantity, od.unit_price
    FROM OrderDetails od
    INNER JOIN Products p ON od.product_id = p.product_id
    WHERE od.order_id = ?`,
    [orderId]
  );

  // Log the rows returned
  console.log("Rows Returned:", rows);

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
        VALUES ($1, $2, $3, $4, $5)
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
        SET quantity = $1, total_price = $2 
        WHERE order_id = $3 AND product_id = $4
      `;
  const values = [quantity, total_price, order_id, product_id];
  await pool.query(query, values);
};

// Remove an item from order details
export const removeOrderDetail = async (order_id, product_id) => {
  const query = `DELETE FROM order_details WHERE order_id = $1 AND product_id = $2`;
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
        VALUES ($1, $2, $3, $4, $5)
      `;
  const values = [order_id, product_id, quantity, price, total_price];
  await pool.query(query, values);
};

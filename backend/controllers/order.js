import {
  getOrders,
  getOrderById,
  getOrderByUserId,
  updateOrder,
  deleteOrder,
  createOrder,
  getOrdersById,
} from "../models/orderModel.js";
import db from "../config/database.js";
import { fetchProductsByIds } from "../models/ProductModel.js";
import {
  fetchOrderDetails,
  createOrderDetail,
  updateOrderDetail,
  removeOrderDetail,
  addOrderDetail,
  fetchSpecificOrderDetails,
} from "../models/OrderDetailModel.js";
import { getUserById } from "../models/userModel.js";
import pool from "../config/database.js";

/**
 * Handler to show all services.
 */
export const showOrders = async (req, res) => {
  try {
    // Get all orders
    const orders = await getOrders();

    // Fetch products for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderDetails = await fetchSpecificOrderDetails(order.order_id);
        const userDetails = await getUserById(order.user_id);

        return { ...order, products: orderDetails, user: userDetails };
      })
    );

    // Respond with orders including product details
    res.status(200).json(ordersWithDetails);
  } catch (err) {
    console.error("Error in showOrders:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const showOrderById = async (req, res) => {
  try {
    // Get the order by ID
    const order = await getOrderById(req.params.id);
    //Get user by ID

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Fetch the products for the order
    const orderDetails = await fetchSpecificOrderDetails(order.order_id);

    // Respond with order and associated products
    res.status(200).json({ ...order, products: orderDetails });
  } catch (err) {
    console.error("Error in showOrderById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const showOrderByUserId = async (user_id) => {
  try {
    // Fetch the order by user ID
    const order = await getOrderByUserId(user_id); // Replace with the actual function to get the order

    if (!order) {
      return null; // No order found for user
    }

    // Fetch the products for the order
    const orderDetails = await fetchSpecificOrderDetails(order.order_id);

    // Return order with products
    return { ...order, products: orderDetails };
  } catch (err) {
    console.error("Error in getOrderByUserId:", err);
    throw new Error("Unable to retrieve order");
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const deletedOrder = await deleteOrder(id);

    if (!deletedOrder) {
      return res.status(500).json({ error: "Failed to delete order" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCategory:", err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate input
    const { order_status } = req.body;

    // Call the service to update the category
    const updatedOrder = await updateOrder(id, req.body);

    if (!updatedOrder) {
      return res.status(500).json({ error: "Failed to update category" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error in updateCategoriesById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createOrderByHook = async (
  user_id,
  lineItems,
  shippingAddress
) => {
  console.log("createOrderByHook", user_id, lineItems, shippingAddress);
  let connection;
  try {
    // Acquire a connection from the pool
    connection = await pool.getConnection();

    // Begin transaction
    await connection.query("BEGIN");

    // Extract product IDs, size IDs, and quantities from lineItems
    const products = lineItems.data.map((lineItem) => ({
      product_id: lineItem.price.product.metadata.product_id,
      size_id: lineItem.price.product.metadata.size_id,
      quantity: lineItem.quantity,
    }));
    const productSizePairs = products.map(({ product_id, size_id }) => [
      product_id,
      size_id,
    ]);

    // Fetch product prices from the database based on (product_id, size_id)
    const [fetchedProducts] = await connection.query(
      `
        SELECT 
          Products.product_id, 
          ProductSizes.size_id, 
          ProductSizes.price 
        FROM 
          Products 
        INNER JOIN 
          ProductSizes ON Products.product_id = ProductSizes.product_id
        WHERE 
          (Products.product_id, ProductSizes.size_id) IN (?)
      `,
      [productSizePairs] // Pass array of pairs (product_id, size_id)
    );
    // Calculate total order amount and create order details
    let totalAmount = 0;

    const orderDetails = products.map((product) => {
      const productData = fetchedProducts.find(
        (p) => p.product_id === Number(product.product_id)
      );
      if (!productData) {
        throw new Error(`Product with ID ${product.product_id} not found`);
      }

      const productTotal = productData.price * product.quantity;
      totalAmount += productTotal;

      return {
        product_id: product.product_id,
        quantity: product.quantity,
        price: productData.price,
        total_price: productTotal,
        size_id: product.size_id,
      };
    });

    // Create the order in the database
    const order_status = "pending"; // Or any default status you want to set
    const order_date = new Date(); // You can adjust this if needed
    const address_line1 = shippingAddress.line1;
    const address_line2 = shippingAddress.line2;
    const postal_code = shippingAddress.postal_code;
    const country = shippingAddress.country;
    const city = shippingAddress.city;

    const [orderResult] = await connection.query(
      "INSERT INTO Orders (user_id, order_status, total_amount, order_date, address_line1, address_line2, postal_code, country, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        order_status,
        totalAmount,
        order_date,
        address_line1,
        address_line2,
        postal_code,
        country,
        city,
      ]
    );
    const newOrderId = orderResult.insertId;

    // Insert order details in bulk
    const orderDetailQueries = orderDetails.map((item) => [
      newOrderId,
      item.product_id,
      item.quantity,
      item.size_id,
      item.price,
    ]);

    await connection.query(
      "INSERT INTO OrderDetails (order_id, product_id, quantity, size_id, unit_price) VALUES ?",
      [orderDetailQueries]
    );

    // Commit the transaction
    await connection.query("COMMIT");

    return {
      message: "Order created successfully",
      order_id: newOrderId,
      orderDetails,
    };
  } catch (err) {
    console.error("Error in createOrderByHook:", err);
    // Rollback the transaction on error
    if (connection) await connection.query("ROLLBACK");
    throw new Error("Internal Server Error");
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
};

export const createNewOrder = async (req, res) => {
  const client = await db.connect(); // For managing the transaction
  try {
    const { user_id, order_status, products, order_date } = req.body; // products: array of { product_id, quantity }

    // Begin transaction
    await client.query("BEGIN");

    // Fetch product prices
    const productIds = products.map((product) => product.product_id);
    const fetchedProducts = await fetchProductsByIds(productIds);
    // Calculate total order amount
    let totalAmount = 0;
    const orderDetails = products.map((product) => {
      const productData = fetchedProducts.find(
        (p) => p.id === product.product_id
      );
      if (!productData) {
        throw new Error(`Product with ID ${product.product_id} not found`);
      }

      const productTotal = productData.price * product.quantity;
      totalAmount += productTotal;

      return {
        product_id: product.product_id,
        quantity: product.quantity,
        price: productData.price,
        total_price: productTotal,
      };
    });

    // Create the order
    const newOrderId = await createOrder(
      user_id,
      order_status,
      totalAmount,
      order_date
    );

    // Insert order details
    for (const item of orderDetails) {
      await createOrderDetail(
        newOrderId,
        item.product_id,
        item.quantity,
        item.price,
        item.total_price
      );
    }

    // Commit transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Order created successfully",
      order_id: newOrderId,
      orderDetails,
    });
  } catch (err) {
    console.error("Error in createNewOrder:", err);
    await client.query("ROLLBACK"); // Rollback transaction on error
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release(); // Release client back to the pool
  }
};

export const editOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { order_id, updatedProducts } = req.body; // updatedProducts: array of { product_id, quantity }

    // Begin transaction
    await client.query("BEGIN");

    // Fetch current order details
    const currentOrderDetails = await fetchOrderDetails(order_id);

    // Get product IDs from the updated products
    const updatedProductIds = updatedProducts.map(
      (product) => product.product_id
    );

    // Fetch product prices for updated products
    const fetchedProducts = await fetchProductsByIds(updatedProductIds);

    // Recalculate total amount and handle product updates, additions, and deletions
    let totalAmount = 0;
    for (const product of updatedProducts) {
      const productData = fetchedProducts.find(
        (p) => p.id === product.product_id
      );
      if (!productData) {
        throw new Error(`Product with ID ${product.product_id} not found`);
      }

      const productTotal = productData.price * product.quantity;
      totalAmount += productTotal;

      const currentProductDetail = currentOrderDetails.find(
        (item) => item.product_id === product.product_id
      );

      if (currentProductDetail) {
        // Product exists in the order; update it if quantity is changed
        if (product.quantity !== currentProductDetail.quantity) {
          await updateOrderDetail(
            order_id,
            product.product_id,
            product.quantity,
            productTotal
          );
        }
      } else {
        // New product being added to the order
        await addOrderDetail(
          order_id,
          product.product_id,
          product.quantity,
          productData.price,
          productTotal
        );
      }
    }

    // Handle product removals (if some existing products are not present in the updated list)
    const productsToRemove = currentOrderDetails.filter(
      (item) => !updatedProductIds.includes(item.product_id)
    );
    for (const product of productsToRemove) {
      await removeOrderDetail(order_id, product.product_id);
    }

    // Update the total amount in the orders table
    await updateOrderTotalAmount(order_id, totalAmount);

    // Commit the transaction
    await client.query("COMMIT");

    res.status(200).json({ message: "Order updated successfully", order_id });
  } catch (err) {
    console.error("Error in editOrder:", err);
    await client.query("ROLLBACK"); // Roll back the transaction on error
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release(); // Release client back to the pool
  }
};

export const showOrdersById = async (req, res) => {
  try {
    // Get the user ID from query parameters
    const userId = req.query.userid;
    console.log(userId);

    // Get the orders by user ID
    const orders = await getOrdersById(userId);

    // Check if orders is null, undefined, or an empty array
    if (!orders || (Array.isArray(orders) && orders.length === 0)) {
      return res.status(200).json([]); // Return an empty array
    }

    // Map over each order and fetch its product details
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const orderDetails = await fetchSpecificOrderDetails(order.order_id);
        return { ...order, products: orderDetails };
      })
    );

    // Respond with orders and associated products
    res.status(200).json(ordersWithProducts);
  } catch (err) {
    console.error("Error in showOrderById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

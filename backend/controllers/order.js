import {
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  createOrder,
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

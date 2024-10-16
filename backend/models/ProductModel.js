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

/**
 * Insert a new product into the database.
 * @param {Object} product - The product object containing details to be inserted.
 * @param {string} product.product_name - The name of the product.
 * @param {string} product.description - The description of the product.
 * @param {number} product.price - The price of the product.
 * @param {number} product.stock_quantity - The stock quantity of the product.
 * @param {number} product.category_id - The ID of the product's category.
 * @returns {Promise<Object>} The result of the insert operation.
 */
export const insertProduct = async (product) => {
  const { product_name, description, price, stock_quantity, category_id } =
    product;
  try {
    const query = `
      INSERT INTO Products (product_name, description, price, stock_quantity, category_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      product_name,
      description,
      price,
      stock_quantity,
      category_id,
    ]);
    return result;
  } catch (err) {
    console.error("Error inserting product:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

/**
 * Update an existing product in the database.
 * @param {Object} product - The product object containing updated details.
 * @param {number} product.product_id - The ID of the product to be updated.
 * @param {string} product.product_name - The updated name of the product.
 * @param {string} product.description - The updated description of the product.
 * @param {number} product.price - The updated price of the product.
 * @param {number} product.stock_quantity - The updated stock quantity of the product.
 * @param {number} product.category_id - The updated ID of the product's category.
 * @returns {Promise<Object>} The result of the update operation.
 */
export const editProduct = async (product) => {
  const {
    product_id,
    product_name,
    description,
    price,
    stock_quantity,
    category_id,
  } = product;
  try {
    const query = `
      UPDATE Products
      SET product_name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?
      WHERE product_id = ?
    `;
    const [result] = await db.query(query, [
      product_name,
      description,
      price,
      stock_quantity,
      category_id,
      product_id,
    ]);
    return result;
  } catch (err) {
    console.error("Error updating product:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

/**
 * Delete a product from the database.
 * @param {number} productId - The ID of the product to be deleted.
 * @returns {Promise<Object>} The result of the delete operation.
 */
export const trashProduct = async (productId) => {
  try {
    const query = `DELETE FROM Products WHERE product_id = ?`;
    const [result] = await db.query(query, [productId]);
    return result;
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

// Fetch products and their prices by product IDs
export const fetchProductsByIds = async (productIds) => {
  const query = `SELECT id, price FROM Products WHERE id = ANY(?)`;
  const { rows } = await db.query(query, [productIds]);
  return rows;
};

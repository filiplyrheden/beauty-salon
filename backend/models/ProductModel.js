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
  console.log(product);
  const {
    product_name,
    description,
    price,
    stock_quantity,
    category_id,
    image_url_primary,
    image_url_secondary,
    image_url_third,
  } = product;
  try {
    const query = `
      INSERT INTO Products (product_name, description, price, stock_quantity, category_id, image_url_primary, image_url_secondary, image_url_third)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      product_name,
      description,
      price,
      stock_quantity,
      category_id,
      image_url_primary,
      image_url_secondary,
      image_url_third,
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
    image_url_primary,
    image_url_secondary,
    image_url_third,
  } = product;
  try {
    const query = `
      UPDATE Products
      SET product_name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url_primary = ?, image_url_secondary = ?, image_url_third = ?
      WHERE product_id = ?
    `;
    const [result] = await db.query(query, [
      product_name,
      description,
      price,
      stock_quantity,
      category_id,
      image_url_primary,
      image_url_secondary,
      image_url_third,
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

export const fetchCheckoutProductsByIds = async (productIds) => {
  // Convert the productIds array to a comma-separated string
  const idsString = productIds.join(',');

  // Use the string inside the SQL query
  const query = `SELECT product_id, price, product_name FROM Products WHERE product_id IN (${idsString})`;

  // Assuming you're using a MySQL client like mysql2 or similar:
  const [rows] = await db.query(query);
  return rows;
};


export const getProductsWithInfo = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.product_id,
      p.product_name,
      p.description,
      p.price,
      p.stock_quantity,
      p.created_at,
      p.image_url_primary,
      p.image_url_secondary,
      p.image_url_third,
      JSON_OBJECT(
          'category_id', c.category_id,
          'category_name', c.category_name,
          'parent_category_id', c.parent_category_id
      ) AS category
    FROM 
      products p
    LEFT JOIN
      categories c ON p.category_id = c.category_id
    GROUP BY 
      p.product_id;
  `);
  return rows;
};

// Fetch a single product and its price by product ID
export const getProductById = async (productId) => {
  const query = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.description, 
      p.price, 
      p.stock_quantity, 
      p.image_url_primary,
      p.image_url_secondary,
      p.image_url_third,
      c.category_name
    FROM Products p
    INNER JOIN Categories c ON p.category_id = c.category_id
    WHERE p.product_id = ? LIMIT 1
  `;

  const [rows] = await db.query(query, [productId]);
  return rows[0]; // Return the first row of the result
};

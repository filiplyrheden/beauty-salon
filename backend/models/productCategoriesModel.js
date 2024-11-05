import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getCategories = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Categories");
    return rows;
  } catch (err) {
    console.error("Error fetching Categories:", err);
    throw err;
  }
};

export const getCategoriesById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Categories WHERE category_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    throw err;
  }
};

export const createCategories = async (categoryData) => {
  const { category_name, parent_category_id } = categoryData;
  try {
    const [result] = await db.query(
      "INSERT INTO Categories (category_name, parent_category_id) VALUES (?,?)",
      [category_name, parent_category_id]
    );

    // Return the newly created category ID or some acknowledgment
    return { category_id: result.insertId, ...categoryData };
  } catch (err) {
    console.error("Error creating Category:", err);
    throw err;
  }
};

export const updateCategories = async (id, categoryData) => {
  const { category_name, parent_category_id } = categoryData;
  try {
    const [result] = await db.query(
      "UPDATE Categories SET category_name = ?, parent_category_id = ? WHERE category_id = ?",
      [category_name, parent_category_id, id]
    );

    // Check if the category was found and updated
    if (result.affectedRows === 0) {
      return null; // No category was found with the provided ID
    }

    categoryData.category_id = id; // Include the category ID in the returned data
    // In Backend's updateServicesCategories
    return { category_id: id, ...categoryData };
  } catch (err) {
    console.error("Error updating Service Category:", err);
    throw err;
  }
};

export const deleteCategories = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    // Delete associated services
    await connection.query("DELETE FROM Products WHERE category_id = ?", [id]);
    // Delete the category
    const [result] = await connection.query(
      "DELETE FROM Categories WHERE category_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }
    await connection.commit();
    return { message: "Categories deleted successfully" };
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting Categories:", err);
    throw err;
  } finally {
    connection.release();
  }
};

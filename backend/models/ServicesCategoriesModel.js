import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getServicesCategories = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM serviceCategories");
    return rows;
  } catch (err) {
    console.error("Error fetching services:", err);
    throw err;
  }
};

export const getServicesCategoriesById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM serviceCategories WHERE category_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error("Error fetching service category by ID:", err);
    throw err;
  }
};

export const createServicesCategories = async (categoryData) => {
  const { category_name } = categoryData;
  try {
    const [result] = await db.query(
      "INSERT INTO serviceCategories (category_name) VALUES (?)",
      [category_name]
    );

    // Return the newly created category ID or some acknowledgment
    return { category_id: result.insertId, ...categoryData };
  } catch (err) {
    console.error("Error creating Service Category:", err);
    throw err;
  }
};

export const updateServicesCategories = async (id, categoryData) => {
  const { category_name } = categoryData;
  try {
    const [result] = await db.query(
      "UPDATE serviceCategories SET category_name = ? WHERE category_id = ?",
      [category_name, id]
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

export const deleteServicesCategories = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    // Delete associated services
    await connection.query("DELETE FROM Services WHERE category_id = ?", [id]);
    // Delete the category
    const [result] = await connection.query(
      "DELETE FROM serviceCategories WHERE category_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }
    await connection.commit();
    return { message: "ServiceCategory deleted successfully" };
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting SC:", err);
    throw err;
  } finally {
    connection.release();
  }
};

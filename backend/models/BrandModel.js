import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getBrands = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Brands");
    return rows;
  } catch (err) {
    console.error("Error fetching services:", err);
    throw err;
  }
};

export const getBrandById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM Brands WHERE brand_id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error("Error fetching Brand by ID:", err);
    throw err;
  }
};

export const createBrand = async (brandData) => {
  const { brand_name } = brandData;
  try {
    const [result] = await db.query(
      "INSERT INTO Brands (brand_name) VALUES (?)",
      [brand_name]
    );

    // Return the newly created brand ID or some acknowledgment
    return { brand_id: result.insertId, ...brandData };
  } catch (err) {
    console.error("Error creating Service brand:", err);
    throw err;
  }
};

export const updateBrand = async (id, brandData) => {
  const { brand_name } = brandData;
  try {
    const [result] = await db.query(
      "UPDATE Brands SET brand_name = ? WHERE brand_id = ?",
      [brand_name, id]
    );

    // Check if the brand was found and updated
    if (result.affectedRows === 0) {
      return null; // No brand was found with the provided ID
    }

    brandData.brand_id = id; // Include the brand ID in the returned data
    // In Backend's updateBrands
    return { brand_id: id, ...brandData };
  } catch (err) {
    console.error("Error updating Service brand:", err);
    throw err;
  }
};

export const deleteBrand = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    // Delete associated services
    await connection.query("DELETE FROM Services WHERE brand_id = ?", [id]);
    // Delete the brand
    const [result] = await connection.query(
      "DELETE FROM Brands WHERE brand_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }
    await connection.commit();
    return { message: "ServiceBrand deleted successfully" };
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting SC:", err);
    throw err;
  } finally {
    connection.release();
  }
};

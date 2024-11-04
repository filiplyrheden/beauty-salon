import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getProperties = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM ProductProperties"); // Adjust the SQL query as needed
    return rows;
  } catch (err) {
    console.error("Error fetching Product Properties:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

export const getPropertyById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM ProductProperties WHERE property_id = ?", [
      id,
    ]);

    // If no property is found with the provided ID
    if (rows.length === 0) {
      return null;
    }

    return rows[0]; // Return the first (and only) property found
  } catch (err) {
    console.error("Error fetching property by ID:", err);
    throw err;
  }
};

export const createProperty = async (propertyData) => {
  const { name} =
    propertyData;

  try {
    const [result] = await db.query(
      "INSERT INTO ProductProperties (name) VALUES (?)",
      [name]
    );

    // Return the newly created property ID or some acknowledgment
    return { property_id: result.insertId, ...propertyData };
  } catch (err) {
    console.error("Error creating property:", err);
    throw err;
  }
};

export const updateProperty = async (id, propertyData) => {
  const { name } =
    propertyData; // Include image_url

  try {
    const [result] = await db.query(
      "UPDATE ProductProperties SET name = ? WHERE property_id = ?",
      [name, id]
    );

    // Check if the property was found and updated
    if (result.affectedRows === 0) {
      return null; // No property was found with the provided ID
    }
    propertyData.property_id = id; // Include the property ID in the returned data
    return { id, ...propertyData }; // Return the updated property data
  } catch (err) {
    console.error("Error updating property:", err);
    throw err;
  }
};

export const deleteProperty = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM ProductProperties WHERE property_id = ?", [
      id,
    ]);

    // Check if a property was deleted
    if (result.affectedRows === 0) {
      return null; // No property was found with the provided ID
    }

    return { message: "property deleted successfully" };
  } catch (err) {
    console.error("Error deleting property:", err);
    throw err;
  }
};

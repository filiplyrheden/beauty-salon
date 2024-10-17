import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getServices = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Services"); // Adjust the SQL query as needed
    return rows;
  } catch (err) {
    console.error("Error fetching services:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

export const getServiceById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Services WHERE service_id = ?",
      [id]
    );

    // If no service is found with the provided ID
    if (rows.length === 0) {
      return null;
    }

    return rows[0]; // Return the first (and only) service found
  } catch (err) {
    console.error("Error fetching service by ID:", err);
    throw err;
  }
};
export const createService = async (serviceData) => {
  const {
    name,
    description,
    time,
    price,
    after_image_url,
    before_image_url,
    booking_link,
    category_id,
  } = serviceData;

  try {
    const [result] = await db.query(
      "INSERT INTO Services (name, description, time, price, after_image_url, before_image_url, booking_link, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        description,
        time,
        price,
        after_image_url,
        before_image_url,
        booking_link,
        category_id,
      ]
    );

    // Return the newly created service ID or some acknowledgment
    return { service_id: result.insertId, ...serviceData };
  } catch (err) {
    console.error("Error creating service:", err);
    throw err;
  }
};

export const updateService = async (id, serviceData) => {
  const {
    name,
    description,
    time,
    price,
    after_image_url,
    before_image_url,
    booking_link,
    category_id,
  } = serviceData;

  try {
    const [result] = await db.query(
      "UPDATE Services SET name = ?, description = ?, time = ?, price = ?, after_image_url = ?, before_image_url = ?, booking_link = ?, category_id= ? WHERE service_id = ?",
      [
        name,
        description,
        time,
        price,
        after_image_url,
        before_image_url,
        booking_link,
        category_id,
        id,
      ]
    );

    // Check if the service was found and updated
    if (result.affectedRows === 0) {
      return null; // No service was found with the provided ID
    }
    serviceData.service_id = id; // Include the service ID in the returned data
    return { id, ...serviceData }; // Return the updated service data
  } catch (err) {
    console.error("Error updating service:", err);
    throw err;
  }
};

export const deleteService = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM Services WHERE service_id = ?",
      [id]
    );

    // Check if a service was deleted
    if (result.affectedRows === 0) {
      return null; // No service was found with the provided ID
    }

    return { message: "Service deleted successfully" };
  } catch (err) {
    console.error("Error deleting service:", err);
    throw err;
  }
};

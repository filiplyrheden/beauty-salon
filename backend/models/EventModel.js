import db from "../config/database.js";

/**
 * Fetch all events from the database.
 * @returns {Promise<Array>} An array of events.
 */
export const getEvents = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Events");
    return rows;
  } catch (err) {
    console.error("Error fetching events:", err.message); // Log specific error message
    throw err; // Propagate the error to be handled by the controller
  }
};

export const getEventById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM Events WHERE event_id = ?", [id]);
    return rows;
  } catch (err) {
    console.error("Error fetching event:", err.message); // Log specific error message
    throw err; // Propagate the error to be handled by the controller
  }
};


/**
 * Insert a new event into the database.
 * @param {Object} event - The event object containing details to be inserted.
 * @param {string} event.name - The name of the event.
 * @param {string} event.description - The description of the event.
 * @param {number} event.price - The price of the event.
 *  * @param {number} event.schedule - The time of the event.
 * @param {string} event.image_url - The URL of the event image.
 * @param {string} event.booking_link - The booking link for the event.
 * @returns {Promise<Object>} The result of the insert operation.
 */
export const insertEvent = async (event) => {
  const { name, description, price, schedule, image_url, booking_link } = event;
  try {
    const query = `
      INSERT INTO Events (name, description, price, schedule, image_url, booking_link)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      name,
      description,
      price,
      schedule,
      image_url,
      booking_link,
    ]);
    return result;
  } catch (err) {
    console.error("Error inserting event:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

/**
 * Update an existing event in the database.
 * @param {number} eventId - The ID of the event to be updated.
 * @param {Object} event - The event object containing updated details.
 * @param {string} event.name - The updated name of the event.
 * @param {string} event.description - The updated description of the event.
 * @param {number} event.price - The updated price of the event.
 * @param {string} event.image_url - The updated URL of the event image.
 * @param {string} event.booking_link - The updated booking link for the event.
 * @returns {Promise<Object>} The result of the update operation.
 */
export const editEvent = async (eventId, event) => {
  const { name, description, price, image_url, booking_link, schedule } = event;
  try {
    const query = `
      UPDATE Events
      SET name = ?, description = ?, price = ?, schedule = ?, image_url = ?, booking_link = ?
      WHERE event_id = ?
    `;
    const [result] = await db.query(query, [
      name,
      description,
      price,
      schedule,
      image_url,
      booking_link,
      eventId,
    ]);
    return result;
  } catch (err) {
    console.error("Error updating event:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

/**
 * Delete an event from the database.
 * @param {number} eventId - The ID of the event to be deleted.
 * @returns {Promise<Object>} The result of the delete operation.
 */
export const trashEvent = async (eventId) => {
  try {
    const query = `DELETE FROM Events WHERE event_id = ?`;
    const [result] = await db.query(query, [eventId]);
    return result;
  } catch (err) {
    console.error("Error deleting event:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

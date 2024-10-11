import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getPageReviews = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM PageReviews");
    return rows;
  } catch (err) {
    console.error("Error fetching services:", err);
    throw err;
  }
};

export const getPageReviewsById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM PageReviews WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error("Error fetching pageReviewby ID:", err);
    throw err;
  }
};

export const createPageReviews = async (reviewData) => {
  const { rating, review_text } = reviewData;
  try {
    const [result] = await db.query(
      "INSERT INTO PageReviews (rating, review_text) VALUES (?,?)",
      [rating, review_text]
    );

    // Return the newly created review ID or some acknowledgment
    return { id: result.insertId, ...reviewData };
  } catch (err) {
    console.error("Error creating PageReview:", err);
    throw err;
  }
};

export const updatePageReviews = async (id, reviewData) => {
  const { rating, review_text } = reviewData;
  try {
    const [result] = await db.query(
      "UPDATE PageReviews SET rating = ?, review_text = ? WHERE id = ?",
      [rating, review_text, id]
    );

    // Check if the review was found and updated
    if (result.affectedRows === 0) {
      return null; // No review was found with the provided ID
    }

    reviewData.id = id; // Include the category ID in the returned data
    // In Backend's updateServicesCategories
    return { id: id, ...reviewData };
  } catch (err) {
    console.error("Error updating Page Review:", err);
    throw err;
  }
};

export const deletePageReviews = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM PageReviews WHERE id = ?", [
      id,
    ]);
    return { message: "PageReview deleted successfully" };
  } catch (err) {
    console.error("Error deleting SC:", err);
    throw err;
  }
};

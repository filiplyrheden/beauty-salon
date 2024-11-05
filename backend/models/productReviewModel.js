import db from "../config/database.js";

/**
 * Fetch all product reviews by product ID from the database.
 * @param {number} productId - The ID of the product.
 * @returns {Promise<Array>} An array of product reviews.
 */
export const getProductReviewsByProductId = async (productId) => {
    try {
      // Use a parameterized query to avoid SQL injection
      const [rows] = await db.query("SELECT * FROM ProductReviews WHERE product_id = ?", [productId]);
      return rows;
    } catch (err) {
      console.error("Error fetching product reviews:", err);
      throw err; // Propagate the error to be handled by the controller
    }
  };
  export const getProductReviews = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM ProductReviews");
        return rows;
    } catch (error) {
        console.log("Error fetching product reviews:", error);
        throw error;
    }
  };
  export const updateProductReview = async (id, reviewData) => {
    const { rating, review_text } = reviewData;
    try {
      const [result] = await db.query(
        "UPDATE ProductReviews SET rating = ?, review_text = ? WHERE id = ?",
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
  
  export const deleteProductReviews = async (id) => {
    try {
      const [result] = await db.query("DELETE FROM ProductReviews WHERE id = ?", [
        id,
      ]);
      return { message: "ProductReview deleted successfully" };
    } catch (err) {
      console.error("Error deleting SC:", err);
      throw err;
    }
  };
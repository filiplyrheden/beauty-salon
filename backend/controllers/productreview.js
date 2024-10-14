import {
    getProductReviewsByProductId,
    getProductReviews,
    updateProductReview,
    deleteProductReviews,
  } from "../models/productReviewModel.js";

export const showProductReviewsById = async (req, res) => {
    try {
      const service = await getProductReviewsByProductId(req.params.id);
      res.status(200).json(service);
    } catch (err) {
      console.error("Error in PageReviewsById:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  export const showProductReviews = async (req, res) => {
    try {
        const service = await getProductReviews();
        res.status(200).json(service);
    } catch (error) {
        console.error("Error in showPageReviews:", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
  };

  export const updateProductReviewById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);

        const { rating, review_text } = req.body;

        // Call the service to update the PageReview
        const updatedProductReview = await updateProductReview(id, req.body);
    
        if (!updatedProductReview) {
          return res.status(500).json({ error: "Failed to update Product Review" });
        }
    
        res.status(200).json(updatedProductReview);
      } catch (err) {
        console.error("Error in updatePageReviewsById:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
  };

  export const deleteProductReviewsById = async (req, res) => {
    try {
      const id = req.params.id;
      const existingProductReview = await getProductReviewsByProductId(id);
      if (!existingProductReview) {
        return res.status(404).json({ error: "Page Review not found" });
      }
  
      const deletedProductReview = await deleteProductReviews(id);
  
      if (!deletedProductReview) {
        return res.status(500).json({ error: "Failed to delete Page Reviews" });
      }
      res.status(200).json({ message: "Page Review deleted successfully" });
    } catch (err) {
      console.error("Error in PageReviews:", err);
  
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
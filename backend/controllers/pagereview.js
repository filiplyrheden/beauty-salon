import {
  getPageReviews,
  getPageReviewsById,
  updatePageReviews,
  deletePageReviews,
  createPageReviews,
} from "../models/pageReviewsModel.js";
import { handleValidationErrors } from "../verificationMiddleware/validator.js";
import { check } from "express-validator";
/**
 * Handler to show all services.
 */
export const showPageReviews = async (req, res) => {
  try {
    const services = await getPageReviews();
    res.status(200).json(services);
  } catch (err) {
    console.error("Error in getPageReviews:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const showPageReviewsById = async (req, res) => {
  try {
    const service = await getPageReviewsById(req.params.id);
    res.status(200).json(service);
  } catch (err) {
    console.error("Error in PageReviewsById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deletePageReviewsById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingPageReview = await getPageReviewsById(id);
    if (!existingPageReview) {
      return res.status(404).json({ error: "Page Review not found" });
    }

    const deletedPageReview = await deletePageReviews(id);

    if (!deletedPageReview) {
      return res.status(500).json({ error: "Failed to delete Page Reviews" });
    }
    res.status(200).json({ message: "Page Review deleted successfully" });
  } catch (err) {
    console.error("Error in PageReviews:", err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const validationRules = [
  check("rating")
    .isInt({ min: 1, max: 5 }).withMessage("Betyg måste vara mellan 1 och 5"),
  
  check("review_text")
    .notEmpty().withMessage("Recension är obligatorisk")
    .isLength({ min: 10 }).withMessage("Recensionen måste vara minst 10 tecken lång"),
];

export const updatePageReviewsById = [
  ...validationRules,
  handleValidationErrors,

  async (req, res) => {
    try {
      const id = req.params.id;
  
      // Validate input
      const { rating, review_text } = req.body;
  
      // Call the service to update the PageReview
      const updatedPageReview = await updatePageReviews(id, req.body);
  
      if (!updatedPageReview) {
        return res.status(500).json({ error: "Failed to update Page Review" });
      }
  
      res.status(200).json(updatedPageReview);
    } catch (err) {
      console.error("Error in updatePageReviewsById:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
];


export const createNewPageReviews = [
  ...validationRules,
  handleValidationErrors,

  async (req, res) => {
    try {
      const { rating, review_text } = req.body;
      const newPageReview = await createPageReviews({ rating, review_text });
      res.status(201).json(newPageReview);
    } catch (err) {
      console.error("Error in createPageReviews:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
];



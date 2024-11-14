import {
  getCategories,
  getCategoriesById,
  updateCategories,
  deleteCategories,
  createCategories,
} from "../models/productCategoriesModel.js";
import { handleValidationErrors } from "../verificationMiddleware/validator.js";
import { body, validationResult } from "express-validator";

/**
 * Handler to show all services.
 */
export const showCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error in getCategories:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const showCategoriesById = async (req, res) => {
  try {
    const category = await getCategoriesById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    console.error("Error in showCategoriesById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteCategoriesById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingCategory = await getCategoriesById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const deletedCategory = await deleteCategories(id);

    if (!deletedCategory) {
      return res.status(500).json({ error: "Failed to delete category" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCategory:", err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateCategoriesById = [
  body("category_name")
    .trim()
    .notEmpty()
    .withMessage("Kategorinamn är obligatoriskt")
    .isLength({ min: 3, max: 50 })
    .withMessage("Kategorinamn ska vara mellan 3 och 50 tecken")
    .matches(/^[a-zA-Z0-9_ åäöÅÄÖ]*$/)
    .withMessage(
      "Kategorinamn får endast innehålla bokstäver, siffror, understreck och mellanslag"
    ),

  // Validation for optional parent_category_id
  body("parent_category_id")
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage(
      "Föräldrakategori-ID måste vara ett positivt heltal om det anges"
    ),

  handleValidationErrors,

  async (req, res) => {
    try {
      const id = req.params.id;

      // Validate input
      const { category_name, parent_category_id } = req.body;

      // Call the service to update the category
      const updatedCategory = await updateCategories(id, req.body);

      if (!updatedCategory) {
        return res.status(500).json({ error: "Failed to update category" });
      }

      res.status(200).json(updatedCategory);
    } catch (err) {
      console.error("Error in updateCategoriesById:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

export const createNewCategories = [
  body("category_name")
    .trim()
    .notEmpty()
    .withMessage("Kategorinamn är obligatoriskt")
    .isLength({ min: 3, max: 50 })
    .withMessage("Kategorinamn ska vara mellan 3 och 50 tecken")
    .matches(/^[a-zA-Z0-9_ åäöÅÄÖ]*$/)
    .withMessage(
      "Kategorinamn får endast innehålla bokstäver, siffror, understreck och mellanslag"
    ),

  // Validation for optional parent_category_id
  body("parent_category_id")
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage(
      "Föräldrakategori-ID måste vara ett positivt heltal om det anges"
    ),

  handleValidationErrors,

  async (req, res) => {
    try {
      const { category_name, parent_category_id } = req.body;
      if (!category_name || category_name.trim() === "") {
        return res.status(400).json({ error: "Category name is required" });
      }
      const newCategory = await createCategories({
        category_name,
        parent_category_id,
      });
      res.status(201).json(newCategory);
    } catch (err) {
      console.error("Error in createNewCategories:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

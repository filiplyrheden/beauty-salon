import {
  getServicesCategories,
  getServicesCategoriesById,
  updateServicesCategories,
  deleteServicesCategories,
  createServicesCategories,
} from "../models/ServicesCategoriesModel.js";
import { handleValidationErrors } from "../verificationMiddleware/validator.js";
import { check } from "express-validator";

const validationRules = [
  check("category_name")
    .notEmpty().withMessage("Kategorinamn är obligatoriskt")
    .isLength({ min: 3 }).withMessage("Kategorinamn måste vara minst 3 karaktärer")
];

/**
 * Handler to show all services.
 */
export const showServicesCategories = async (req, res) => {
  try {
    const services = await getServicesCategories();
    res.status(200).json(services);
  } catch (err) {
    console.error("Error in getServicesCategories:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const showServicesCategoriesById = async (req, res) => {
  try {
    const service = await getServicesCategoriesById(req.params.id);
    res.status(200).json(service);
  } catch (err) {
    console.error("Error in showServiceById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteServicesCategoriesById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingCategory = await getServicesCategoriesById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const deletedCategory = await deleteServicesCategories(id);

    if (!deletedCategory) {
      return res.status(500).json({ error: "Failed to delete category" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error in deleteServices:", err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateServicesCategoriesById = [
  ...validationRules,
  handleValidationErrors,
  
  async (req, res) => {
    try {
      const id = req.params.id;
  
      // Validate input
      const { category_name } = req.body;
      if (!category_name || category_name.trim() === "") {
        return res.status(400).json({ error: "Category name is required" });
      }
  
      // Call the service to update the category
      const updatedCategory = await updateServicesCategories(id, req.body);
  
      if (!updatedCategory) {
        return res.status(500).json({ error: "Failed to update category" });
      }
  
      res.status(200).json(updatedCategory);
    } catch (err) {
      console.error("Error in updateServicesCategoriesById:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
];

export const createNewServicesCategories = [
  ...validationRules,
  handleValidationErrors,


  async (req, res) => {
    try {
      const { category_name } = req.body;
      if (!category_name || category_name.trim() === "") {
        return res.status(400).json({ error: "Category name is required" });
      }
      const newCategory = await createServicesCategories({ category_name });
      res.status(201).json(newCategory);
    } catch (err) {
      console.error("Error in createServicesCategories:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
];



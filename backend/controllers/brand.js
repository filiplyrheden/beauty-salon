import {
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  createBrand,
} from "../models/BrandModel.js";
import { handleValidationErrors } from "../verificationMiddleware/validator.js";
import { body } from "express-validator";

/**
 * Handler to show all services.
 */
export const showBrands = async (req, res) => {
  try {
    const services = await getBrands();
    res.status(200).json(services);
  } catch (err) {
    console.error("Error in showBrands:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const showBrandById = async (req, res) => {
  try {
    const service = await getBrandById(req.params.id);
    res.status(200).json(service);
  } catch (err) {
    console.error("Error in showServiceById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteBrandById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingBrand = await getBrandById(id);
    if (!existingBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const deletedBrand = await deleteBrand(id);

    if (!deletedBrand) {
      return res.status(500).json({ error: "Failed to delete Brand" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (err) {
    console.error("Error in deleteServices:", err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateBrandById = [
  // Validation middleware for brand_name
  body("brand_name")
    .trim()
    .notEmpty()
    .withMessage("Varumärkesnamn är obligatoriskt")
    .isLength({ min: 3, max: 50 })
    .withMessage("Varumärkesnamn ska vara mellan 3 och 50 tecken")
    .matches(/^[a-zA-Z0-9_ åäöÅÄÖ]*$/)
    .withMessage(
      "Varumärkesnamn får endast innehålla bokstäver, siffror, understreck och mellanslag"
    ),
  handleValidationErrors, // Middleware to handle validation errors

  async (req, res) => {
    console.log("im inside async now");
    try {
      const id = req.params.id;

      // Call the service to update the brand
      const updatedBrand = await updateBrand(id, req.body);

      if (!updatedBrand) {
        return res.status(500).json({ error: "Failed to update Brand" });
      }

      res.status(200).json(updatedBrand);
    } catch (err) {
      console.error("Error in updateServicesCategoriesById:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

export const createNewBrand = [
  body("brand_name")
    .trim()
    .notEmpty()
    .withMessage("Varumärkesnamn är obligatoriskt")
    .isLength({ min: 3, max: 50 })
    .withMessage("Varumärkesnamn ska vara mellan 3 och 50 tecken")
    .matches(/^[a-zA-Z0-9_ åäöÅÄÖ]*$/)
    .withMessage(
      "Varumärkesnamn får endast innehålla bokstäver, siffror, understreck och mellanslag"
    ),
  handleValidationErrors, // Middleware to handle validation errors

  async (req, res) => {
    try {
      const { brand_name } = req.body;

      const newBrand = await createBrand({ brand_name });

      res.status(201).json(newBrand);
    } catch (err) {
      console.error("Error in createServicesCategories:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

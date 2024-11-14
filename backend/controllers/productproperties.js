// PropertyController.js
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../models/productPropertyModel.js";

import { handleValidationErrors } from "../verificationMiddleware/validator.js";
import { body, validationResult } from "express-validator";
/**
 * Handler to show all Properties.
 */
export const showProperties = async (req, res) => {
  try {
    const Properties = await getProperties();
    res.status(200).json(Properties);
  } catch (err) {
    console.error("Error in showProperties:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to show a single Property by ID.
 */
export const showPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const Property = await getPropertyById(id);

    if (!Property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(Property);
  } catch (err) {
    console.error("Error in showPropertyById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to create a new Property.
 */
export const createNewProperty = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Egenskapsnamn är obligatoriskt")
    .isLength({ min: 3, max: 50 })
    .withMessage("Egenskapsnamn ska vara mellan 3 och 50 tecken")
    .matches(/^[a-zA-Z0-9_ åäöÅÄÖ]*$/)
    .withMessage(
      "Egenskapsnamn får endast innehålla bokstäver, siffror, understreck och mellanslag"
    ),
  handleValidationErrors,
  async (req, res) => {
    try {
      const PropertyData = req.body;
      console.log(PropertyData);
      const newProperty = await createProperty(PropertyData);
      res.status(201).json(newProperty);
    } catch (err) {
      console.error("Error in createNewProperty:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];
/**
 * Handler to update an existing Property by ID.
 */
export const updatePropertyById = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Egenskapsnamn är obligatoriskt")
    .isLength({ min: 3, max: 50 })
    .withMessage("Egenskapsnamn ska vara mellan 3 och 50 tecken")
    .matches(/^[a-zA-Z0-9_ åäöÅÄÖ]*$/)
    .withMessage(
      "Egenskapsnamn får endast innehålla bokstäver, siffror, understreck och mellanslag"
    ),

  handleValidationErrors,

  async (req, res) => {
    try {
      const { id } = req.params;
      const PropertyData = req.body;

      const updatedProperty = await updateProperty(id, PropertyData);
      res.status(200).json(updatedProperty);
    } catch (err) {
      console.error("Error in updatePropertyById:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

/**
 * Handler to delete a Property by ID.
 */
export const deletePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    // Get existing Property
    const existingProperty = await getPropertyById(id);
    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    const deletedProperty = await deleteProperty(id);

    if (!deletedProperty) {
      return res.status(500).json({ error: "Failed to delete Property" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error in deletePropertyById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

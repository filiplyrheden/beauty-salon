import { getServicesCategories } from "../models/ServicesCategoriesModel.js";

/**
 * Handler to show all services.
 */
export const showServicesCategories = async (req, res) => {
  try {
    const services = await getServicesCategories();
    res.status(200).json(services);
  } catch (err) {
    console.error("Error in showServices:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

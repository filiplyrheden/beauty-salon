import {
  getServicesCategories,
  getServicesCategoriesById,
  updateServicesCategories,
  deleteServicesCategories,
  createServicesCategories,
} from "../models/ServicesCategoriesModel.js";

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
export const updateProduct = async (req, res) => {
  const product = req.body; // Get product details from the request body

  try {
    const result = await editProduct(product);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error in updateProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateServicesCategoriesById = async (req, res) => {
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
};

export const createNewServicesCategories = async (req, res) => {
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
};

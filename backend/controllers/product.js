import {
  getProducts,
  insertProduct,
  editProduct,
  trashProduct,
  getProductById,
  getProductsWithInfo,
  fetchCheckoutProductsByIds,
  getFeaturedProducts,
} from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

/**
 * Handler to show all products.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const showProducts = async (req, res) => {
  try {
    const products = await getProductsWithInfo();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in showProducts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const showallProducts = async (req, res) => {
  try {
    const products = await getProductsWithInfo();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in showProductsWithInfo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const showFeaturedProducts = async (req, res) => {
  try {
    const products = await getFeaturedProducts();
    console.log("featured products inside product controller: " + products);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in showFeaturedProducts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCheckoutProducts = async (res, dummyItems) => {
  try {
    // Fetch product and size details for each (product_id, size_id) pair
    const products = await fetchCheckoutProductsByIds(dummyItems);
    console.log("do I work to fetch prices?????");
    // Create line items with the correct quantity, size, and price for each product
    const line_items = products.map((product) => {
      // Find the matching item in dummyItems to get the quantity
      const matchingItem = dummyItems.find(
        (item) =>
          item.product_id === product.product_id &&
          item.size_id === product.size_id
      );

      return {
        price_data: {
          currency: "SEK",
          product_data: {
            name: `${product.product_name} (${product.size})`, // Include size in the name
            metadata: {
              product_id: product.product_id,
              size_id: product.size_id,
            },
          },
          unit_amount: Math.round(product.price * 100), // Multiply by 100 for correct format
        },
        quantity: matchingItem ? matchingItem.quantity : 1, // Default to 1 if not found
      };
    });

    return line_items;
  } catch (err) {
    console.error("Error in getCheckoutProducts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body; // Get product details from the request body
  const files = req.files;
  console.log(product);
  console.log(files);

  if (typeof product.sizes === "string") {
    try {
      product.sizes = JSON.parse(product.sizes);
    } catch (error) {
      console.error("Error parsing sizes:", error);
      return res.status(400).json({ error: "Invalid sizes format" });
    }
  }

  if (typeof product.properties === "string") {
    try {
      product.properties = JSON.parse(product.properties);
    } catch (error) {
      console.error("Error parsing sizes:", error);
      return res.status(400).json({ error: "Invalid sizes format" });
    }
  }

  console.log(product.properties);

  // Get the file paths for the uploaded images
  const primaryImagePath = req.files.primaryImage[0].filename;
  const secondaryImagePath = req.files.secondaryImage[0].filename;
  const thirdImagePath = req.files.thirdImage[0].filename;

  // Construct URLs for both images
  const primaryImageUrl = `${req.protocol}://${req.get(
    "host"
  )}/uploads/${primaryImagePath}`;
  const secondaryImageUrl = `${req.protocol}://${req.get(
    "host"
  )}/uploads/${secondaryImagePath}`;
  const thirdImageUrl = `${req.protocol}://${req.get(
    "host"
  )}/uploads/${thirdImagePath}`;

  // Add image URLs to service data
  const newProductData = {
    ...product,
    image_url_primary: primaryImageUrl,
    image_url_secondary: secondaryImageUrl,
    image_url_third: thirdImageUrl,
  };

  try {
    const result = await insertProduct(newProductData);
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.error("Error in createProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to update an existing product.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const updateProduct = async (req, res) => {
  const product = req.body;
  console.log(product);
  console.log("---------------------------------");
  const files = req.files || {}; // Ensure files is an object to avoid undefined
  const productId = product.product_id;
  console.log(files);

  const existingProduct = await getProductById(productId);
  console.log(
    "existing product with images that needs to be deleted if there are new images uploaded: ",
    existingProduct
  );

  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Check if files exist before trying to access them
  const primaryImagePath = files.primaryImage
    ? files.primaryImage[0]?.filename
    : null;
  const secondaryImagePath = files.secondaryImage
    ? files.secondaryImage[0]?.filename
    : null;
  const thirdImagePath = files.thirdImage
    ? files.thirdImage[0]?.filename
    : null;

  console.log("primary image path (new) : " + primaryImagePath);
  console.log("secondary image path (new) : " + secondaryImagePath);
  console.log("third image path (new) : " + thirdImagePath);

  // Array to hold existing image paths for deletion
  const existingImages = [
    existingProduct.image_url_primary,
    existingProduct.image_url_secondary,
    existingProduct.image_url_third,
  ];
  console.log("existing images: ");
  console.log(existingImages);

  // Deleting images only if a new image is uploaded
  if (existingImages) {
    existingImages.forEach((imagePath, index) => {
      // Determine if there's a new image for this index
      const newImagePath = [
        primaryImagePath,
        secondaryImagePath,
        thirdImagePath,
      ][index];

      // Only delete existing image if there is a new image uploaded
      if (newImagePath) {
        // Proceed only if there's a new image path
        if (imagePath) {
          const fullPath = path.join("uploads", path.basename(imagePath));

          if (fs.existsSync(fullPath)) {
            // Check if the file exists
            fs.unlink(fullPath, (err) => {
              if (err) {
                console.error(`Failed to delete image at ${fullPath}:`, err);
              } else {
                console.log("Deleted image with fullPath: " + fullPath);
              }
            });
          } else {
            console.log(`Image does not exist at path: ${fullPath}`);
          }
        }
      }
    });
  }

  // Construct URLs for uploaded images if they exist
  const primaryImageUrl = primaryImagePath
    ? `${req.protocol}://${req.get("host")}/uploads/${primaryImagePath}`
    : existingProduct.image_url_primary;
  const secondaryImageUrl = secondaryImagePath
    ? `${req.protocol}://${req.get("host")}/uploads/${secondaryImagePath}`
    : existingProduct.image_url_secondary;
  const thirdImageUrl = thirdImagePath
    ? `${req.protocol}://${req.get("host")}/uploads/${thirdImagePath}`
    : existingProduct.image_url_third;

  // Add image URLs to the product data
  const newProductData = {
    ...product,
    image_url_primary: primaryImageUrl,
    image_url_secondary: secondaryImageUrl,
    image_url_third: thirdImageUrl,
  };

  console.log("new product data:", newProductData);

  try {
    const result = await editProduct(newProductData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error in updateProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to delete a product from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  console.log("productId inside controller: " + productId);

  const existingProduct = await getProductById(productId);

  const existingImages = [
    existingProduct.image_url_primary,
    existingProduct.image_url_secondary,
    existingProduct.image_url_third,
  ];

  existingImages.forEach((imagePath) => {
    const fullPath = path.join("uploads", path.basename(imagePath));

    if (fs.existsSync(fullPath)) {
      // Check if the file exists
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete image at ${fullPath}:`, err);
        } else {
          console.log("Deleted image with fullPath: " + fullPath);
        }
      });
    } else {
      console.log(`Image does not exist at path: ${fullPath}`);
    }
  });

  try {
    const result = await trashProduct(productId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error in deleteProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to delete a product from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const GetProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await getProductById(productId);
    if (result.Rows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ result });
  } catch (err) {
    console.error("Error in GetProuctById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

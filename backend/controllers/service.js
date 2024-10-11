// ServiceController.js
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../models/ServiceModel.js";
import path from "path";
import fs from "fs";

/**
 * Handler to show all services.
 */
export const showServices = async (req, res) => {
  try {
    const services = await getServices();
    res.status(200).json(services);
  } catch (err) {
    console.error("Error in showServices:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to show a single service by ID.
 */
export const showServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error("Error in showServiceById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to create a new service.
 */
export const createNewService = async (req, res) => {
  try {
    const serviceData = req.body;
    console.log(req.files); // Should display the uploaded files
    console.log(req.body); // Should display the form data

    // Check if both images were uploaded
    if (!req.files || !req.files.beforeImage || !req.files.afterImage) {
      return res
        .status(400)
        .json({ error: "Both before and after images are required" });
    }

    // Get the file paths for the uploaded images
    const beforeImagePath = req.files.beforeImage[0].filename;
    const afterImagePath = req.files.afterImage[0].filename;

    // Construct URLs for both images
    const beforeImageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${beforeImagePath}`;
    const afterImageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${afterImagePath}`;

    // Add image URLs to service data
    const newServiceData = {
      ...serviceData,
      before_image_url: beforeImageUrl,
      after_image_url: afterImageUrl,
    };

    // Assuming createService is a function that saves the service data to the database
    const newService = await createService(newServiceData);

    // Return the newly created service
    res.status(201).json(newService);
  } catch (err) {
    console.error("Error in createNewService:", err);

    // Handle any errors related to uploaded images by removing orphaned files
    if (req.files) {
      if (req.files.beforeImage) {
        fs.unlink(
          path.join("uploads", req.files.beforeImage[0].filename),
          (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                "Error deleting before image after failed service creation:",
                unlinkErr
              );
            }
          }
        );
      }
      if (req.files.afterImage) {
        fs.unlink(
          path.join("uploads", req.files.afterImage[0].filename),
          (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                "Error deleting after image after failed service creation:",
                unlinkErr
              );
            }
          }
        );
      }
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to update a service by ID.
 */
export const updateServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceData = req.body;

    // Get existing service
    const existingService = await getServiceById(id);
    if (!existingService) {
      // If the service doesn't exist and a new image was uploaded, remove the new image
      if (req.file) {
        fs.unlink(path.join("uploads", req.file.filename), (unlinkErr) => {
          if (unlinkErr) {
            console.error(
              "Error deleting uploaded image after service not found:",
              unlinkErr
            );
          }
        });
      }
      return res.status(404).json({ error: "Service not found" });
    }

    // Check for new images in the request
    if (req.files) {
      // Handle the before image
      if (req.files.beforeImage) {
        const beforeImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
          req.files.beforeImage[0].filename
        }`;
        serviceData.before_image_url = beforeImageUrl;

        // Delete the old before image file if it exists
        if (existingService.before_image_url) {
          const oldBeforeImagePath = path.join(
            "uploads",
            path.basename(existingService.before_image_url)
          );
          fs.unlink(oldBeforeImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting old before image:", unlinkErr);
              // Proceed even if the old image deletion fails
            }
          });
        }
      }

      // Handle the after image
      if (req.files.afterImage) {
        const afterImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
          req.files.afterImage[0].filename
        }`;
        serviceData.after_image_url = afterImageUrl;

        // Delete the old after image file if it exists
        if (existingService.after_image_url) {
          const oldAfterImagePath = path.join(
            "uploads",
            path.basename(existingService.after_image_url)
          );
          fs.unlink(oldAfterImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting old after image:", unlinkErr);
              // Proceed even if the old image deletion fails
            }
          });
        }
      }
    }

    // Update the service with the new data
    const updatedService = await updateService(id, serviceData);

    if (!updatedService) {
      // If updating failed and new images were uploaded, remove the new images to prevent orphaned files
      if (req.files) {
        if (req.files.beforeImage) {
          fs.unlink(
            path.join("uploads", req.files.beforeImage[0].filename),
            (unlinkErr) => {
              if (unlinkErr) {
                console.error(
                  "Error deleting uploaded before image after failed update:",
                  unlinkErr
                );
              }
            }
          );
        }
        if (req.files.afterImage) {
          fs.unlink(
            path.join("uploads", req.files.afterImage[0].filename),
            (unlinkErr) => {
              if (unlinkErr) {
                console.error(
                  "Error deleting uploaded after image after failed update:",
                  unlinkErr
                );
              }
            }
          );
        }
      }
      return res.status(500).json({ error: "Failed to update service" });
    }

    res.status(200).json(updatedService);
  } catch (err) {
    console.error("Error in updateServiceById:", err);

    // If there was an error and new images were uploaded, remove the new images to prevent orphaned files
    if (req.files) {
      if (req.files.beforeImage) {
        fs.unlink(
          path.join("uploads", req.files.beforeImage[0].filename),
          (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                "Error deleting uploaded before image after failed update:",
                unlinkErr
              );
            }
          }
        );
      }
      if (req.files.afterImage) {
        fs.unlink(
          path.join("uploads", req.files.afterImage[0].filename),
          (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                "Error deleting uploaded after image after failed update:",
                unlinkErr
              );
            }
          }
        );
      }
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to delete a service by ID.
 */
export const deleteServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get existing service
    const existingService = await getServiceById(id);
    if (!existingService) {
      return res.status(404).json({ error: "Service not found" });
    }

    const deletedService = await deleteService(id);

    if (!deletedService) {
      return res.status(500).json({ error: "Failed to delete service" });
    }

    // Function to delete image file if it exists
    const deleteImageFile = (imageUrl) => {
      if (imageUrl) {
        const imagePath = path.join("uploads", path.basename(imageUrl));

        // Check if the file exists before attempting to delete
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(imagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting image file:", unlinkErr);
                // Not sending error to client since the service is already deleted
              }
            });
          } else {
            console.warn(`Image file not found: ${imagePath}`);
          }
        });
      } else {
        console.warn(
          "No image URL found for the service, skipping deletion of image."
        );
      }
    };

    // Delete both associated image files if they exist
    deleteImageFile(existingService.before_image_url);
    deleteImageFile(existingService.after_image_url);

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error in deleteServiceById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

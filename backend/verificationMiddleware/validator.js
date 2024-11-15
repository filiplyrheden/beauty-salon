import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Handle single file uploads
    if (req.file) {
      fs.unlink(path.join("uploads", req.file.filename), (err) => {
        if (err) {
          console.error(
            "Error deleting single file after validation failure:",
            err
          );
        }
      });
    }

    // Handle multiple files (array or fields)
    if (req.files) {
      // If req.files is an object (fields):
      if (typeof req.files === "object" && !Array.isArray(req.files)) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            fs.unlink(path.join("uploads", file.filename), (err) => {
              if (err) {
                console.error(
                  "Error deleting file after validation failure:",
                  err
                );
              }
            });
          });
        });
      } else if (Array.isArray(req.files)) {
        // If req.files is an array:
        req.files.forEach((file) => {
          fs.unlink(path.join("uploads", file.filename), (err) => {
            if (err) {
              console.error(
                "Error deleting file after validation failure:",
                err
              );
            }
          });
        });
      }
    }

    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

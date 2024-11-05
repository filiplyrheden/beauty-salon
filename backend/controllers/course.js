// CourseController.js
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../models/CourseModel.js";
import path from "path";
import fs from "fs";

/**
 * Handler to show all courses.
 */
export const showCourses = async (req, res) => {
  try {
    const courses = await getCourses();
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error in showCourses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to show a single course by ID.
 */
export const showCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    console.error("Error in showCourseById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to create a new course.
 */
export const createNewCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Construct image URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    // Add image_url to course data
    const newCourseData = {
      ...courseData,
      image_url: imageUrl,
    };

    const newCourse = await createCourse(newCourseData);

    res.status(201).json(newCourse);
  } catch (err) {
    console.error("Error in createNewCourse:", err);

    // If there was an error and the image was uploaded, remove the image to prevent orphaned files
    if (req.file) {
      fs.unlink(path.join("uploads", req.file.filename), (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            "Error deleting uploaded image after failed course creation:",
            unlinkErr
          );
        }
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to update an existing course by ID.
 */
export const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    // Get existing course
    const existingCourse = await getCourseById(id);
    if (!existingCourse) {
      // If a new image was uploaded, remove it since the course doesn't exist
      if (req.file) {
        fs.unlink(path.join("uploads", req.file.filename), (unlinkErr) => {
          if (unlinkErr) {
            console.error(
              "Error deleting uploaded image after course not found:",
              unlinkErr
            );
          }
        });
      }
      return res.status(404).json({ error: "Course not found" });
    }

    // If a new image is uploaded, set the new image_url and delete the old image
    if (req.file) {
      const newImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      courseData.image_url = newImageUrl;

      // Delete the old image file
      const oldImagePath = path.join(
        "uploads",
        path.basename(existingCourse.image_url)
      );
      fs.unlink(oldImagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting old image:", unlinkErr);
          // Proceed even if the old image deletion fails
        }
      });
    }

    const updatedCourse = await updateCourse(id, courseData);

    if (!updatedCourse) {
      // If updating failed and a new image was uploaded, remove the new image to prevent orphaned files
      if (req.file) {
        fs.unlink(path.join("uploads", req.file.filename), (unlinkErr) => {
          if (unlinkErr) {
            console.error(
              "Error deleting uploaded image after failed update:",
              unlinkErr
            );
          }
        });
      }
      return res.status(500).json({ error: "Failed to update course" });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    console.error("Error in updateCourseById:", err);

    // If there was an error and a new image was uploaded, remove the new image to prevent orphaned files
    if (req.file) {
      fs.unlink(path.join("uploads", req.file.filename), (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            "Error deleting uploaded image after failed update:",
            unlinkErr
          );
        }
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to delete a course by ID.
 */
export const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get existing course
    const existingCourse = await getCourseById(id);
    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    const deletedCourse = await deleteCourse(id);

    if (!deletedCourse) {
      return res.status(500).json({ error: "Failed to delete course" });
    }

    // Delete the associated image file
    const imagePath = path.join(
      "uploads",
      path.basename(existingCourse.image_url)
    );
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image file:", unlinkErr);
        // Not sending error to client since the course is already deleted
      }
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCourseById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

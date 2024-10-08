import db from "../config/database.js";

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} An array of products.
 */
export const getCourses = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Courses"); // Adjust the SQL query as needed
    return rows;
  } catch (err) {
    console.error("Error fetching courses:", err);
    throw err; // Propagate the error to be handled by the controller
  }
};

export const getCourseById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM Courses WHERE course_id = ?", [
      id,
    ]);

    // If no course is found with the provided ID
    if (rows.length === 0) {
      return null;
    }

    return rows[0]; // Return the first (and only) course found
  } catch (err) {
    console.error("Error fetching course by ID:", err);
    throw err;
  }
};

export const createCourse = async (courseData) => {
  const { name, description, schedule, price, image_url, booking_link } =
    courseData; // Include image_url

  try {
    const [result] = await db.query(
      "INSERT INTO Courses (name, description, schedule, price, image_url, booking_link) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, schedule, price, image_url, booking_link] // Add image_url to the query
    );

    // Return the newly created course ID or some acknowledgment
    return { course_id: result.insertId, ...courseData };
  } catch (err) {
    console.error("Error creating course:", err);
    throw err;
  }
};

export const updateCourse = async (id, courseData) => {
  const { name, description, schedule, price, image_url, booking_link } =
    courseData; // Include image_url

  try {
    const [result] = await db.query(
      "UPDATE Courses SET name = ?, description = ?, schedule = ?, price = ?, image_url = ?, booking_link = ? WHERE course_id = ?",
      [name, description, schedule, price, image_url, booking_link, id] // Add image_url to the query
    );

    // Check if the course was found and updated
    if (result.affectedRows === 0) {
      return null; // No course was found with the provided ID
    }

    return { id, ...courseData }; // Return the updated course data
  } catch (err) {
    console.error("Error updating course:", err);
    throw err;
  }
};

export const deleteCourse = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM Courses WHERE course_id = ?", [
      id,
    ]);

    // Check if a course was deleted
    if (result.affectedRows === 0) {
      return null; // No course was found with the provided ID
    }

    return { message: "Course deleted successfully" };
  } catch (err) {
    console.error("Error deleting course:", err);
    throw err;
  }
};

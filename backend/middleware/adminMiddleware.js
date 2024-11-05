import db from "../config/database.js";

const adminMiddleware = async (req, res, next) => {
  console.log("hej req user:", req.user); // Make sure req.user is properly logged
  const userId = req.user.userid; // Ensure this is correctly set in the userMiddleware
  console.log("User ID:", userId);

  try {
    const [user] = await db.query("SELECT * FROM Users WHERE user_id = ?", [
      userId,
    ]); // Change user_id to id if that's the column name

    // Log the fetched user object to understand its structure
    console.log("Fetched user:", user);
    console.log("User role:", user[0].role);
    // Check if user exists and has admin role
    if (user && user[0].role === "admin") {
      next(); // User is an admin
    } else {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default adminMiddleware;

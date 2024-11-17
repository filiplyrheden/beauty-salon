import db from "../config/database.js";

const adminMiddleware = async (req, res, next) => {
  const userId = req.user.userid; // Ensure this is correctly set in the userMiddleware

  try {
    const [user] = await db.query("SELECT * FROM Users WHERE user_id = ?", [
      userId,
    ]);

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

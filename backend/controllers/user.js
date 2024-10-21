import {
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../models/userModel.js";

/**
 * Handler to show all users.
 */

export const showUserById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in userById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "Page Review not found" });
    }

    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return res.status(500).json({ error: "Failed to delete User" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUser:", err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const id = String(req.params.id);
    const loggedInUserId = String(req.user.userid);
    const isAdmin = req.user.role === "admin"; // Check if the user has admin privileges

    if (id !== loggedInUserId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    // Extract and validate the input fields from the request body
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      address_line1,
      address_line2,
      city,
      postal_code,
      country,
    } = req.body;

    const updatedUser = await updateUser(id, req.body);

    if (!updatedUser) {
      return res.status(500).json({ error: "Failed to update user profile" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error in updateUserById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createNewUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      address_line1,
      address_line2,
      city,
      postal_code,
      country,
    } = req.body;
    const newUser = await createUser({
      role: "customer",
      first_name,
      last_name,
      email,
      password,
      phone,
      address_line1,
      address_line2,
      city,
      postal_code,
      country,
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

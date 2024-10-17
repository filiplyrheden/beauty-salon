import {
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../models/userModel.js";

/**
 * Handler to show all services.
 */

export const showUserById = async (req, res) => {
  try {
    const service = await getUserById(req.params.id);
    res.status(200).json(service);
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
    const id = req.params.id;
    const loggedInUserId = req.user.id;
    const isAdmin = req.user.role === "admin";

    //added check so that users can only update their own profile
    if (userId !== loggedInUserId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }
    // Validate input
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
    // Call the service to update the PageReview
    const updatedUser = await updateUser(id, req.body);

    if (!updatedUser) {
      return res.status(500).json({ error: "Failed to update Page Review" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error in updatePageReviewsById:", err);
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

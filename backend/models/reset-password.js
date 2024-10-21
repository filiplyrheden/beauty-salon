import db from "../config/database.js";

export const validateEmail = async (email) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM Users WHERE email = ?",
        [email]
      );
  
      // If no user is found with the provided email
      if (rows.length === 0) {
        return null;
      }
  
      return rows[0]; // Return the first (and only) user found
    } catch (err) {
      console.error("Error fetching user by email:", err);
      throw err;
    }
  };

  export const updateToken = async (resetToken, resetTokenExpiry, email) => {
    try {
      const [result] = await db.query(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, resetTokenExpiry, email]
      );
  
      // If no rows were affected, it means no user was found with the provided email
      if (result.affectedRows === 0) {
        return null;
      }
      return true
    } catch (err) {
      console.error("Error updating user with reset_token:", err);
      throw err;
    }
  };

  export const getUserByResettoken = async (token) => {
    try {
      // Compare reset_token_expiry (DATETIME) with the current date/time
      const [rows] = await db.query(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?',
        [token, new Date()]
      );
  
      // If no user is found or the token has expired
      if (rows.length === 0) {
        return null;
      }
  
      return rows[0]; // Return the user found
    } catch (err) {
      console.error("Error fetching user by reset token:", err);
      throw err;
    }
  };

  export const insertNewPassword = async (hashedPassword, userid) => {
    try {
      const [result] = await db.query
      ('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?', 
        [hashedPassword, userid]);
  
      // If no rows were affected, it means no user was found with the provided email
      if (result.affectedRows === 0) {
        return null;
      }
      return true
    } catch (err) {
      console.error("Error updating user with reset_token:", err);
      throw err;
    }
  };
  
  
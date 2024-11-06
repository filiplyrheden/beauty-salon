import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
    validateEmail,
    updateToken,
    getUserByResettoken,
    insertNewPassword,
} from '../models/reset-password.js';

export const sendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await validateEmail(email);
        console.log(user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = uuidv4();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        const tokenUpdateResult = await updateToken(resetToken, resetTokenExpiry, email);
        if (!tokenUpdateResult) {
            return res.status(500).json({ message: 'Error inserting token into user' });
        }

        // Send email with the token
        const transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            auth: {
                user: 'e94629177f6af5a49799d421c5ecee29',
                pass: 'ba67f72e78ca40371ffc7b57c900e523',
            },
        });

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: 'lucas@ackerberg.se', // Use your registered Mailjet email
            to: 'lucas@ackerberg.se',
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password.</p>`,
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error("Error in SendCode controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find user by token and check if the token is still valid
    const user = await getUserByResettoken(token);
    if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const userid = user.user_id;

        // Update the user's password and remove the reset token
        const newUser = await insertNewPassword(hashedPassword, userid);
        if (!newUser) return res.status(400).json({ message: 'Error inserting password' });

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error("Error in ResetPassword controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

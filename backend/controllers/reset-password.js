/* import nodemailer from 'nodemailer'; */
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
    validateEmail,
    updateToken,
    getUserByResettoken,
    insertNewPassword,
} from '../models/reset-password.js';
import brevo from '@getbrevo/brevo';

export const sendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await validateEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = uuidv4();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        const tokenUpdateResult = await updateToken(resetToken, resetTokenExpiry, email);
        if (!tokenUpdateResult) {
            return res.status(500).json({ message: 'Error inserting token into user' });
        }

        // Initialize the API instance and API key directly
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "My {{params.subject}}";
        sendSmtpEmail.sender = { "name": "Lucas", "email": "lucas@ackerberg.se" };
        sendSmtpEmail.to = [{ "email": `${email}`, "name": "sample-name" }];
        sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "token": `${resetToken}`, "subject": "Lösenordsåterställning" };
        sendSmtpEmail.templateId = 1;


        apiInstance.sendTransacEmail(sendSmtpEmail).then(
            function (data) {
                console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                res.status(200).json({ message: 'Reset email sent successfully' });
            },
            function (error) {
                console.error(error);
                res.status(500).json({ message: 'Error sending email' });
            }
        );
    } catch (error) {
        console.error("Error in sendCode function:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find user by token and check if the token is still valid
    const user = await getUserByResettoken(token);
    if (!user) return res.status(400).json({ message: 'Token är ogiltig eller har gått ut' });

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

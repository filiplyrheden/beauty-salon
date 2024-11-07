import brevo from '@getbrevo/brevo';

export const sendContactForm = async (req, res) =>{
    try{
        const contactDetails = req.body;

        // Initialize the API instance and API key directly
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API);

        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `Nytt meddelande från kontaktformulär`;
        sendSmtpEmail.sender = { "name": `${contactDetails.name}`, "email": "lucas@ackerberg.se" };
        sendSmtpEmail.to = [{ "email": `lucas@ackerberg.se`, "name": "sample-name" }]; // Ändra sen
        sendSmtpEmail.replyTo = { "email": `${contactDetails.email}`, "name": "sample-name" };
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.htmlContent = `<html><body><p>${contactDetails.message}</p></body></html>`; // ÄNDRA DENNA MED VAD VI VILL HA

        /* sendSmtpEmail.params = { "token": `${resetToken}`, "subject": "Lösenordsåterställning" }; */

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
    console.error("Error in sendConatctForm function:", error);
    res.status(500).json({ message: 'Internal Server Error' });
    }
};
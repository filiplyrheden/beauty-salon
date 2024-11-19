import brevo from '@getbrevo/brevo';
import { getOrderById } from '../models/orderModel.js'
import { fetchSpecificOrderDetails } from '../models/OrderDetailModel.js';
export const sendOrderEmails = async (order_id, email ) =>{
    try{

      const order = await getOrderById(order_id);
      const products = await fetchSpecificOrderDetails(order.order_id);

        // Initialize the API instance and API key directly
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API);

        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `Ny beställning från SN Beauty`;
        sendSmtpEmail.sender = { "name": `SN Beauty`, "email": "lucas@ackerberg.se" };
        sendSmtpEmail.to = [{ "email": `${email}`}]; 
        sendSmtpEmail.replyTo = { "email": "lucas@ackerberg.se", "name": `SN Beauty` };

        sendSmtpEmail.htmlContent = `
        <html>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
            <!-- Main Table Wrapper -->
            <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="background-color: #f9f9f9; padding: 0;">
              <tr>
                <td align="center">
                  <!-- Inner Content Table -->
                  <table width="600" cellspacing="0" cellpadding="0" border="0" role="presentation" style="background-color: #fff; border: 1px solid black; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); padding: 40px;">
                    <tr>
                      <td>
                        <!-- Header Section -->
                        <h1 style="color: #333; font-family: 'Playfair Display', serif; text-align: center; margin-bottom: 32px;">
                          TACK FÖR DIN BESTÄLLNING
                        </h1>
                        
                        <!-- Order Information -->
                        <p style="font-size: 16px; text-align: center;">
                          Vi uppskattar att du handlar hos oss, din beställning
                          <strong>#${order.order_id}</strong> är för nuvarande
                          <strong>${order.order_status}</strong>.
                          <br />
                          Du har blivit debiterad
                          <strong>${formatCurrency(order.total_amount)}</strong>.
                        </p>
                        <p style="font-size: 16px; text-align: center;">
                          Order Datum:
                          <strong>${formatDate(order.order_date)}</strong>
                        </p>
                        
                        <!-- Products Section (If Available) -->
                        ${products.length > 0 ? `
                          <h2 style="color: #333; font-family: 'Playfair Display', serif; text-align: center; margin-bottom: 32px; margin-top: 16px;">
                            PRODUKTER I DIN BESTÄLLNING:
                          </h2>
                          <ul style="list-style-type: none; padding: 0; margin: 0; text-align: center;">
                            ${products.map(product => `
                              <li style="margin: 6px 0; font-size: 16px;">
                                ${product.product_name} (${product.size}) - ${product.quantity} x ${formatCurrency(product.unit_price)}
                              </li>
                            `).join('')}
                          </ul>
                        ` : ''}
                        
                        <!-- Contact Information -->
                        <p style="font-size: 16px; text-align: center;">
                          Om du har några frågor, emaila
                          <a href="mailto:info@snbeauty.se" style="color: #007bff; text-decoration: none;">info@snbeauty.se</a>.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `;
        
      
               

      apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
          console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        },
        function (error) {
          console.error(error);
        }
      );
    } catch (error) {
      console.error("Error in sendOrderEmails function:", error);
    }
};

export const sendUpdateEmail = async () => {
try {
    // Initialize the API instance and API key directly
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API);

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `Nu Beställning`;
    sendSmtpEmail.sender = { "name": `SN Beauty`, "email": "lucas@ackerberg.se" };
    sendSmtpEmail.to = [{ "email": `lucas@ackerberg.se`}]; /* ÄNDRA SEN */
    sendSmtpEmail.replyTo = { "email": "noreply@ackerberg.se", "name": `NoReply` };
    sendSmtpEmail.htmlContent = `
<html>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
    <!-- Main Table Wrapper -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="background-color: #f9f9f9; padding: 0;">
      <tr>
        <td align="center">
          <!-- Inner Content Table -->
          <table width="600" cellspacing="0" cellpadding="0" border="0" role="presentation" style="background-color: #fff; border: 1px solid black; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); padding: 40px;">
            <tr>
              <td>
                <!-- Header Section -->
                <h1 style="color: #333; font-family: 'Playfair Display', serif; text-align: center; margin-bottom: 32px;">
                  DU HAR FÅTT EN NY BESTÄLLNING
                </h1>
                
                <!-- Main Message -->
                <p style="font-size: 16px; text-align: center;">
                  Du har mottagit en ny beställning. Kolla orderpanelen för mer info <a href="http://www.sn-beauty.se/admin/orders" style="color: #007bff; text-decoration: none;">Här</a>.
                </p>
                
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  },
  function (error) {
    console.error(error);
  }
);
} catch (error) {
console.error("Error in sendOrderEmails function:", error);
}

}

export const addToNewsletter = async (req, res) => {

    const email = req.body.email;
    
    try {
        // Initialize the API instance and API key directly
        const apiInstance = new brevo.ContactsApi();
        const createContact = new brevo.CreateContact();
        apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API);
    
        createContact.email = email;
        createContact.listIds = [3];

        apiInstance.createContact(createContact).then(function(data) 
            {
                console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            },
            function (error) {
                console.error(error);
            }
        );
        res.status(201).json({ message: "Du är nu registrerad på nyhesbrevet!"});
        } catch (error) {
            console.error("Error in addToNewsletter function:", error);
            res.status(500).json({ error: "Internt serverfel" });
        }   
}

const formatCurrency = (amount) => {
  return (amount * 1).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
  });
}
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}
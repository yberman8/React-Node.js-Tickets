import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class CreateNewTicketMail {
  constructor() { }
  static async sendEmail(ticket) {

    const mailOptions = {
      from: 'reskosher@gmail.com',
      to: ticket.email,
      subject: ticket.email_subject,
      html: `<div style="direction: rtl"><span>הפנייה נוצרה בהצלחה!, תוכן ההודעה:</span><br><span>${ticket.responses[0].message}</span></div>`,
    };


    let transformMail = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "reskosher@gmail.com",
        pass: process.env.EMAIL_PASSWORD
      },
      connectionTimeout: 6000,
    });



    try {
      const result = await Promise.race([
        transformMail.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Email sending timed out")), 6000)
        ),
      ]);
      ticket.message_id = result?.messageId;
      ticket.save();
      return { emailSent: true };
    } catch (error) {
      console.log("Error sending email" + error.toString());
      return { emailSent: false };
    }

  }
}

export default CreateNewTicketMail;

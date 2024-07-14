import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class ReplayToTicketEmail {
  constructor() { }
  static async sendEmail(ticket, replyContent, ticketStatus) {

    let message = replyContent;
    if (ticketStatus === 'close') {
      message = replyContent
    }

    const mailOptions = {
      from: 'reskosher@gmail.com',
      to: ticket.email,
      subject: ticket.email_subject,
      html: `<div style="direction: rtl"><span>${message}</span></div>`,
      inReplyTo: ticket.message_id,
      references: ticket.references ? ticket.references.concat(ticket.message_id).join(' ') : ticket.message_id
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
      return { emailSent: true };
    } catch (error) {
      console.log("Error sending email" + error.toString());
      return { emailSent: false };
    }

  }
}

export default ReplayToTicketEmail;

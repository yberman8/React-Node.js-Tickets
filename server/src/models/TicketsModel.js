import dotenv from 'dotenv';
import Tickets from '../../config/models/tickets.js';
import Users from '../../config/models/users.js';
import Email from '../util/createNewTicketMail.js';
import ReplayEmail from '../util/replayToTicketEmail.js';
dotenv.config();

class AuthModel {
  constructor() { }


  static async getTickets(email, role) {

    let tickets;
    if (role === 'admin') {
      tickets = await Tickets.find().populate({ path: 'responses.responder_id', select: 'email name role' }).sort({ createdAt: -1 });  // Sort by created_at in descending order;
    } else {
      tickets = await Tickets.find({ email }).populate({ path: 'responses.responder_id', select: 'email name role' }).sort({ createdAt: -1 });  // Sort by created_at in descending order;
    }
    return tickets;
  }


  static async createTicket(message, subject, email, _id) {

    const ticketObj = {
      responses: [{ message, responder_id: _id }],
      subject: subject,
      email
    }
    const tickets = await Tickets.create(ticketObj);
    tickets.email_subject = `נפתחה פנייה חדשה בנושא: ${tickets.subject}, [Ticket#${tickets.integer_id}]`;
    await tickets.save();
    Email.sendEmail(tickets);


    return tickets;
  }

  static async replayMessage(message, ticketId, _id) {

    const ticket = await Tickets.findById(ticketId);
    ticket.responses.push({ message, responder_id: _id });
    await ticket.save();
    ReplayEmail.sendEmail(ticket, message, "open");

    await ticket.populate({ path: 'responses.responder_id', select: 'email name role' })

    // Get the last response object which contains the new _id
    const addedResponse = ticket.responses[ticket.responses.length - 1];

    return { addedResponse, userTicketiD: ticket.responses[0].responder_id._id, subject: ticket.subject };
  }


  static async getTicketMessages(ticketId, email, role) {

    let ticketMessages;
    if (role === 'admin') {
      ticketMessages = await Tickets.findOne({ _id: ticketId }).populate({ path: 'responses.responder_id', select: 'email name role' })
    } else {
      ticketMessages = await Tickets.findOne({ _id: ticketId, email }).populate({ path: 'responses.responder_id', select: 'email name role' });
    }
    return ticketMessages;

  }


  static async markAsRead(ticketId, role) {

    const currentDate = new Date();
    const ticket = await Tickets.findById(ticketId);
    const lastResponder = await Users.findById(ticket.responses[ticket.responses.length - 1].responder_id);
    if (role !== lastResponder.role) {
      ticket.responses.forEach(response => {
        if (response.read_at === null) {
          response.read_at = currentDate;
        }
      });
      // Save the ticket with the updated responses
      await ticket.save();
    }

    return true;
  }


  static async closeTicket(ticketId) {

    const ticket = await Tickets.findById(ticketId);
    ticket.status = "close";
    await ticket.save();
    return ticket;
  }


}
export default AuthModel;

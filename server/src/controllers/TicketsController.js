import TicketsModel from '../models/TicketsModel.js';
import { getIo } from '../util/socketManager.js';
import ReplayEmail from '../util/replayToTicketEmail.js';

class TicketsController {
  constructor() {
  }


  static async getTickets(request, response) {

    try {
      const { email, role } = request;

      const tickets = await TicketsModel.getTickets(email, role);

      return response.status(200).json(tickets);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }


  static async createTicket(request, response) {

    try {
      const { email, _id, role } = request;
      const { message, subject } = request.body;

      const ticketCreated = await TicketsModel.createTicket(message, subject, email, _id);

      await ticketCreated.populate({ path: 'responses.responder_id', select: 'email name role' })
      // Get the initialized io instance
      const io = await getIo();
      if (role !== 'admin') {
        io.to('admins').emit('newUserTicket', { ticketCreated });
      }

      return response.status(200).json(ticketCreated);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }

  static async replayMessage(request, response) {

    try {
      const { _id, role } = request;
      const { newMessage, ticketId } = request.body;

      const ticketReplyed = await TicketsModel.replayMessage(newMessage, ticketId, _id);
      // Get the initialized io instance
      const io = await getIo();
      if (role === 'admin') {
        console.log(33333);
        console.log(ticketReplyed.userTicketiD.toString());
        io.to(ticketReplyed.userTicketiD.toString()).emit('newAdminReply', { ticketId, newResponse: ticketReplyed.addedResponse, subject: ticketReplyed.subject });
      } else {
        io.to('admins').emit('newUserReply', { ticketId, newResponse: ticketReplyed.addedResponse, subject: ticketReplyed.subject });
      }

      return response.status(200).json(ticketReplyed.addedResponse);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }


  static async getTicketMessages(request, response) {

    try {
      const { email, role } = request;
      const { ticketId } = request.query;

      const messages = await TicketsModel.getTicketMessages(ticketId, email, role);

      return response.status(200).json(messages);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }


  static async markAsRead(request, response) {

    try {
      const { role } = request;
      const { ticketId } = request.query;

      const marked = await TicketsModel.markAsRead(ticketId, role);

      return response.status(200).json(marked);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }


  static async closeTicket(request, response) {

    try {
      const { ticketId } = request.query;
      const closed = await TicketsModel.closeTicket(ticketId);

      ReplayEmail.sendEmail(closed, "הפנייה נסגרה בהצלחה!", "close");

      return response.status(200).json(closed);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }


}
export default TicketsController;

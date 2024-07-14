import express from 'express'
import TicketsController from '../controllers/TicketsController.js';
import authToken from '../middleware/authToken.js';
const router = express.Router();

// בקשות API
router.post('/create_ticket',authToken, TicketsController.createTicket);
router.get('/get_tickets', authToken, TicketsController.getTickets);
router.post('/reply_message',authToken, TicketsController.replayMessage);

router.get('/get_ticket_messages', authToken, TicketsController.getTicketMessages);
router.get('/mark_as_read', authToken, TicketsController.markAsRead);
router.get('/close_ticket', authToken, TicketsController.closeTicket);

export default router;
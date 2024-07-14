import dotenv from 'dotenv';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import Ticket from '../../config/models/tickets.js';
import Users from '../../config/models/users.js';
import { inspect } from 'util';
import { getIo } from './socketManager.js';
import ReplayEmail from './replayToTicketEmail.js';

dotenv.config();

class TicketListener {
    constructor() { }

    static async listen() {
        try {
            console.log("Starting IMAP listener...");

            const imap = new Imap({
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_PASSWORD,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                tlsOptions: { rejectUnauthorized: false }
            });

            imap.once('ready', () => {
                console.log("IMAP connection ready");
                this.openInbox(imap, (err, box) => {
                    if (err) throw err;
                    this.setupMailListener(imap, box);
                });
            });

            imap.once('error', (err) => {
                console.error("IMAP connection error:", err);
            });

            imap.once('end', () => {
                console.log("IMAP connection ended");
            });

            imap.connect();
        } catch (error) {
            console.error("Error starting IMAP listener:", error);
        }
    }

    static openInbox(imap, cb) {
        imap.openBox('INBOX', true, cb);
    }

    static setupMailListener(imap, box) {
        imap.on('mail', (numNewMsgs) => {
            console.log(`New mail event, number of new messages: ${numNewMsgs}`);
            this.fetchLatestEmail(imap, box);
        });
    }

    

    static fetchLatestEmail(imap, box) {
        const f = imap.seq.fetch(`${box.messages.total}:*`, {
            bodies: ['HEADER', 'TEXT'],
            struct: true
        });

        f.on('message', (msg, seqno) => {
            console.log(`Processing message with sequence number: ${seqno}`);
            this.processMessage(msg, seqno);
        });

        f.once('error', (err) => {
            console.error("Fetch error:", err);
        });

        f.once('end', () => {
            console.log("Done fetching the latest message!");
        });
    }

    static processMessage(msg, seqno) {
        let prefix = `(Message #${seqno}) `;
        let parsedHeaders = '';
        let parsedBody = '';

        msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
            });
            stream.once('end', () => {
                if (info.which === 'HEADER') {
                    parsedHeaders = Imap.parseHeader(buffer);
                } else {
                    parsedBody = buffer;
                }
            });
        });

        msg.once('attributes', (attrs) => {
            console.log(prefix + 'Attributes:', inspect(attrs, false, 8));
        });

        msg.once('end', async () => {
            try {
                console.log(prefix + 'Finished');
                await this.handleParsedEmail(parsedHeaders, parsedBody);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    }

    static async handleParsedEmail(parsedHeaders, parsedBody) {
        console.log('Parsed Headers:', parsedHeaders);
        const parsedEmail = await simpleParser(parsedBody);
        console.log('Parsed Email:', parsedEmail);

        let ticketIntegerId = this.extractTicketId(parsedHeaders.subject);
        if (ticketIntegerId) {
            const ticket = await Ticket.findOne({integer_id: ticketIntegerId});
            // const messageId = parsedHeaders['message-id'] ? parsedHeaders['message-id'][0] : '';
            // if (condition) {
                if (ticket) {
                    await this.updateTicket(ticket, parsedEmail, parsedHeaders.from[0]);
                } else {
                    console.error("Ticket not found");
                }
            // }
        } else {
            console.error("Ticket ID not found in subject");
            // Optionally send an automated response here
            this.ticketNotFound(parsedHeaders);
        }
    }

    static extractTicketId(subject) {
        if (subject) {
            const ticketIdMatch = subject[0].match(/\[Ticket#(\w+)\]/);
            return ticketIdMatch ? ticketIdMatch[1] : null;
        }
        return null;
    }

    static async updateTicket(ticket, parsedEmail, fromEmail) {
        if (ticket.status === "open") {
            let newMessageContent = await this.extractNewMessage(parsedEmail.text);
            if (parsedEmail.html) {
                newMessageContent = parsedEmail.html;
            }

            if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
                console.log('Attachments:', parsedEmail.attachments);
            }

            const emailAddress = this.extractEmailAddress(fromEmail);
            const user = await Users.findOne({ email: emailAddress });
            if (user) {
                ticket.responses.push({
                    message: newMessageContent,
                    responder_id: user._id,
                    date: new Date()
                });
                await ticket.save();
                console.log("Ticket updated");

                this.updateSocketReply(ticket, user);
            } else {
                console.log("User not found. fake email.");
            }
        } else {
            console.log("Ticket is not open. No updates made.");
            ReplayEmail.sendEmail(ticket, "הפנייה נסגרה, לא ניתן להגיב לפנייה זו", "close");
        }
    }

    static extractEmailAddress(fromEmail) {
        const emailMatch = fromEmail.match(/<([^>]+)>/);
        return emailMatch ? emailMatch[1] : fromEmail;
    }

    static async updateSocketReply(ticket, user) {

        await ticket.populate({ path: 'responses.responder_id', select: 'email name role' })

        // Get the last response object which contains the new _id
        const addedResponse = ticket.responses[ticket.responses.length - 1];

        // Get the initialized io instance
        const io = await getIo();
        if (user.role === 'user') {
            io.to('admins').emit('newUserReply', { ticketId: ticket._id, newResponse: addedResponse, subject: ticket.subject });
        }
    }

    static ticketNotFound(parsedHeaders) {
        const fromEmail = this.extractEmailAddress(parsedHeaders.from[0]);
        const subject = parsedHeaders.subject ? parsedHeaders.subject[0] : '';
        const messageId = parsedHeaders['message-id'] ? parsedHeaders['message-id'][0] : '';
        const objResponse = {
            email: fromEmail,
            email_subject: subject,
            message_id: messageId,
        }
        ReplayEmail.sendEmail(objResponse, "לא ניתן לפתוח פנייה חדשה דרך האימייל, יש לפתוח פנייה דרך ממשק הניהול", "close");
    }

    static extractNewMessage(messageContent) {
        const replyIndicators = [
            'On',               // English
            'בתאריך',          // Hebrew
            'Le',               // French
            'El',               // Spanish
            'Am'                // German
            // Add more indicators as needed
        ];

        for (const indicator of replyIndicators) {
            const indicatorIndex = messageContent.indexOf(indicator);
            if (indicatorIndex !== -1) {
                return messageContent.substring(0, indicatorIndex).trim();
            }
        }

        return messageContent.trim();
    }
}

export default TicketListener;

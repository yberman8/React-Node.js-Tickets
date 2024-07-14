import mongoose from 'mongoose';

const responsesSchema = new mongoose.Schema({
  responder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    index: true
  },
  read_at: { type: Date, default: null }, 
  message: String,
  type: { type: String, default: 'text' },
}, { timestamps: true }
);

const ticketSchema = new mongoose.Schema({
  subject: String,
  email_subject: String,
  status: { type: String, default: 'open' },
  email: String,
  integer_id: Number,
  message_id:{ type: String, default: ''},
  responses: [responsesSchema],
}, { timestamps: true }
);

// Generate a integer_id from highest increment
ticketSchema.pre('save', async function (next) {

  try {
    if (this.isNew) {
      // Retrieve the maximum integer_id for records with the same line_number
      const maxTicket = await Ticket.findOne().sort('-integer_id');
      this.integer_id = maxTicket ? maxTicket.integer_id + 1 : 1000;
    }
    next();
  } catch (error) {
    return next(error);
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
Ticket.syncIndexes();

export default Ticket;

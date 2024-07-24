import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      default: '',
      validate: {
        validator: function (value) {
          // Check if the email is not empty or null before validating
          if (!value || value === "") {
            return true; // Skip validation if email is empty or null
          }
          // Use a regular expression to check if the email format is valid
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [9, 'Password should be at least 9 characters'],
      validate: {
        validator: function (value) {
          return /[a-zA-Z]/.test(value) && /\d/.test(value);
        },
        message: 'Password should contain both English characters and numbers',
      },
    },
    status: { type: Boolean, default: true },
    card_id: { type: String, required: true },
    role: { type: String, required: true },
    api_token: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash the user's password before saving
// Generate a random API token before saving
usersSchema.pre('save', async function (next) {

  try {
    // i want this actions only in create that the password short before hashing
    if (this.isNew) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;

      let tokenAPI = generateRandomToken();
      this.api_token = tokenAPI;
    }
    next();
  } catch (error) {
    return next(error);
  }
});

const Users = mongoose.model('Users', usersSchema);
Users.syncIndexes();

export default Users;


function generateRandomToken() {
  const chars = 'abcdefghkmnopqrstuvwxyz023456789abcdefghkmnopqrstuvwxyz';
  let tokenAPI = '';

  for (let i = 0; i < 40; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    tokenAPI += chars.charAt(randomIndex);
  }

  return tokenAPI;
}
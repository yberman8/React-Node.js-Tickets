import bcrypt from 'bcrypt';
import AuthModel from '../models/AuthModel.js';
import Token from '../util/Token.js';
import Email_Verify from '../util/Email_Verify.js';

const LOGIN_FAILED_ERROR = "Authentication failed";

class AuthController {
  constructor() {
  }

  // code 2 part 1
  static async Login(request, response) {

    const { email, password } = request.body;
    try {
      const user = await AuthModel.findByEmail(email);
      if (!user?.email) {
        return response.status(400).json({ message: LOGIN_FAILED_ERROR });
      }

      const savedPassword = user.password;
      const comparePass = await bcrypt.compare(password, savedPassword);

      if (!comparePass) {
        return response.status(400).json({ message: LOGIN_FAILED_ERROR });
      }

      // Generate and send SMS verification code
      const verificationCode = Email_Verify.generateVerificationCode(); // Implement the code to generate a verification code
      const smsSent = await Email_Verify.sendVerificationEmail(user.email, verificationCode); // Implement the code to send the verification code via SMS
      if (!smsSent.emailSent) {
        return response.status(400).json({ message: "EMAIL_SEND_ERROR" });
      }
      
      const storeCode = await AuthModel.saveCodeVerify(user._id, verificationCode);
      if (storeCode !== "success") {
        return response.status(400).json({ message: "SMS_SEND_ERROR2" });
      }
      
      return response.status(200).json({ message: "SMS_SEND_SUCCESS" });

    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: "internal error: " + error.message });
    }
  };

  static async verifyEmailCode(request, response) {
    const { email, emailCode } = request.body;
    try {
    
      const user = await AuthModel.findByEmail(email);
      console.log(user);
      if (!user) {
        return response.status(400).json({ message: LOGIN_FAILED_ERROR });
      }

      // Validate SMS code here
      const isValidEmailCode = await Email_Verify.validateEmailCode(user._id, emailCode); // Implement the code to validate the SMS code

      if (!isValidEmailCode.isValid) {
        return response.status(400).json({ message: isValidEmailCode.message });
      }

      // Code to generate a token
      const { _id, name, role, status } = user;
      const newToken = await Token.genToken(_id, email, name, role, status, "4h");

      return response.status(200).json({ token: newToken });
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }


  static async forgotPassword(request, response) {

    const { email } = request.body;
    try {

      const user = await AuthModel.findByEmail(email);
      if (!user?.email) {
        return response.status(401).json("האימייל לא רשום במערכת");
      }
      const userRecord = user;
      const token = await Token.genToken(userRecord._id, userRecord.email, userRecord.name, userRecord.role, null, null, "1h");
      const emailSent = await Email_Verify.sendEmail(email, token, "ressetPass", null);
      response.status(200).json(emailSent);
    } catch (error) {
      console.error(error);
      response.status(500).json("Internal server error");
    }

  };

  // שינוי סיסמה
  static async resetPassword(request, response) {

    const { newPassword } = request.body;
    const userId = request._id;

    try {
      const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);
      const user = await AuthModel.resetPassword(userId, hashedPassword);
      response.status(200).json("passwoerd reseted successfully");
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }

  };


}

export default AuthController;

  
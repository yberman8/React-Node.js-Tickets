import Users from '../../config/models/users.js';
import TempCode from '../../config/models/tempCode.js';

class AuthModel {
  constructor() { }

  // check if email exsit
  static async findByEmail(email) {

    const user = await Users.findOne({ email });
    return user;

  }

  static async saveCodeVerify(userId, codeVerify) {

    const tempCode = {
      user_id: userId,
      email_code_verify: codeVerify
    }

    const saveCode = await TempCode.create(tempCode);

    return "success";
  }



  // handle reset password
  static async resetPassword(userId, newPassword) {

    const result = await Users.updateOne(
      { _id: userId },
      { $set: { password: newPassword } }
    );

    return result;
  }

}

export default AuthModel;

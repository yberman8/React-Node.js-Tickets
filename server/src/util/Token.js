import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class Token {
  constructor() {
  }

  static async genToken(id, email, name, role, status, tokef) {

    const userDetails = { _id: id, _email: email, _name: name, _role: role , _status: status}

    let token = jwt.sign(userDetails, process.env.SECRET_WORD, { expiresIn: tokef })

    return token;
  }

}

export default Token;

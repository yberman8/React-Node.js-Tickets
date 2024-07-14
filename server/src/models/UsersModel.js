import dotenv from 'dotenv';
import Users from '../../config/models/users.js';
dotenv.config();

class UserModel {
  constructor() { }


  static async getUsers() {

      const users = await Users.find();
   
    return users;
  }

  static async createUser(user, passObj) {

    const newUser = {
      name: user.name,
      card_id: user.card_id.trim(),
      phone: user.phone,
      email: user.email.trim(),
      password: passObj.password.trim(),
      status: user.status,
      role: user.role,
    }
   
    const users = await Users.create(newUser);

    return users;
  }

  static async editUser(user) {


    const editedUser = {
      name: user.name,
      card_id: user.card_id.trim(),
      phone: user.phone,
      email: user.email,
      status: user.status,
      role: user.role,
    }

    const userEdited = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: editedUser
      }, // Use $set to specify the fields to update
      { new: true } // Set new option to true to return the updated document
    );

    return userEdited;
  }


  static async deleteUser(id) {

    await Users.findByIdAndDelete(id);

    return true;
  }

  static async findById(_id) {

    const user = await Users.findById(_id);

    return user;

  }


}

export default UserModel;

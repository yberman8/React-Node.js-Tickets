import UsersModel from '../models/UsersModel.js';
import Token from '../util/Token.js';

class UsersController {
  constructor() {
  }


  static async getUsers(request, response) {

    try {
      const { role } = request;

      if (role !== 'admin') {
        return response.status(400).json({ message: "You don't have permission to perform this action." });
      }

      const users = await UsersModel.getUsers();
      return response.status(200).json(users);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }

  static async createUser(request, response) {

    try {
      const { role } = request;
      const {user, passObj} = request.body;

      if (role !== 'admin') {
        return response.status(400).json({ message: "You don't have permission to perform this action." });
      }

      const newUser = await UsersModel.createUser(user, passObj);

      return response.status(200).json(newUser);
    } catch (error) {
      console.log(error);

      return response.status(400).json({ message: error.message });
    }
  }


  static async editUser(request, response) {

    try {
      const { role } = request;
      const {user} = request.body;

      if (role !== 'admin') {
        return response.status(400).json({ message: "You don't have permission to perform this action." });
      }

      const editedUser = await UsersModel.editUser(user);

      return response.status(200).json(editedUser);
    } catch (error) {
      console.log(error);

      return response.status(400).json({ message: error.message });
    }
  }

  static async deleteUser(request, response) {

    try {
      const { role } = request;
      const { id } = request.query;

      if (role !== 'admin') {
        return response.status(400).json({ message: "You don't have permission to perform this action." });
      }

      await UsersModel.deleteUser(id);

      return response.status(200).json(true);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error.message });
    }
  }

  static async swichToUser(request, response) {

    const { role } = request;
    if (role !== 'admin') {
      return response.status(400).json({ message: "You don't have permission to perform this action." });
    }

    try {
      const user = await UsersModel.findById(request.body._id);
      if (!user?._id) {
        return response.status(400).json({ message: "no user found by id" });
      }

      // Code to generate a token
      const { _id, email, name, role, status } = user;
      const newToken = await Token.genToken(_id, email, name, role, status, "3h");

      return response.status(200).json({ token: newToken });
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  };

  

}

export default UsersController;

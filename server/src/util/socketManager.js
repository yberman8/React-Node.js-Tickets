import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Users from "../../config/models/users.js";

let io;
let adminRoom = 'admins';

export const initializeSocket = (server) => {
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle joining rooms based on user role
    socket.on('joinRoom', ({ token }) => {
      (async () => {
        try {
          let decodeToken = jwt.verify(token, process.env.SECRET_WORD);
          let userId = decodeToken._id;
          const user = await Users.findById(userId);

          if (user.role === 'admin') {
            socket.join(adminRoom);
          } else {
            socket.join(userId); // Each user gets their own room
          }
        } catch (error) {
          console.log('Error handling joinRoom event:', error);
        }
      })();
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export const getIo = async () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

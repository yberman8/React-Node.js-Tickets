import express from 'express';
import path from 'path';
import * as url from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import auth from './src/router/authRoute.js';
import tickets from './src/router/ticketsRoute.js';
import users from './src/router/usersRoute.js';
import TicketListener from './src/util/TicketListener.js';
import Users from './config/models/users.js';
import { initializeSocket } from './src/util/socketManager.js'; // Import the socket manager
import http from 'http';

dotenv.config();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const uri = 'mongodb://127.0.0.1:27017/tickets';


export default function server() {


   const app = express();

   // הגדרת אדרים מומלצים של אקספרס
   app.use(
      cors({
         origin: "*",
      })
   );
   app.use(express.json());
   app.use(express.urlencoded({ extended: false }));
   app.use(express.static(path.join(__dirname, 'dist')));

   // Create an HTTP server
   const serverSocket = http.createServer(app);

   mongoose.connect(uri).then(async (results) => {

      //   const eefe = await newUser.save();        

      initializeSocket(serverSocket); // Initialize Socket.io

      serverSocket.listen(process.env.PORT, () => {
         console.log(`Example app listening on port ${process.env.PORT}`);
      });

   }).catch((error) => {
      console.error('Error connecting to the database:', error);
   });

   TicketListener.listen()

   app.use('/auth', auth);
   app.use('/tickets', tickets);
   app.use('/users', users);

   app.use('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });

}



const newUser = new Users(

   { name: "יוסי אדמין", card_id: "311224747", email: "yberman8@gmail.com", password: "ber1167!yossi", role: 'admin'}
);
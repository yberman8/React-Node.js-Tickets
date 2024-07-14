import express from 'express';
import path from 'path';
import * as url from 'url';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import auth from './src/router/authRoute.js';
import tickets from './src/router/ticketsRoute.js';
import users from './src/router/usersRoute.js';
import Ticket from './config/models/tickets.js';
import Users from './config/models/users.js';
import TicketListener from './src/util/TicketListener.js';
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
   app.use("/ticketsTest",express.static(path.join(__dirname, 'dist')));

   // Create an HTTP server
   const serverSocket = http.createServer(app);

   mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async (results) => {

      try {

         //  const eefe = await newUser.save();
         // Define the update operation
         // const updateOperation = {
         //     $set: {
         //       //   'rates.ratings': [], // Set the ratings array to an empty array
         //       //   'rates.totalRatings': 0, // Reset the totalRatings to 0
         //         isWon: false, // Clear the reviews array
         //     },
         // };

         // try {
         //     const result = await Subscribes.updateMany({}, updateOperation);
         //     console.log('Updated successfully:', result);
         //   } catch (err) {
         //     // Handle the error
         //     console.error('Error:', err);
         //   }
         //////////////////////////////////////////

      } catch (error) {
         console.log(error);
      }

      initializeSocket(serverSocket); // Initialize Socket.io

      serverSocket.listen(process.env.PORT, () => {
         console.log('Example app listening on port 3250!');
      });

   }).catch((error) => {
      console.error('Error connecting to the database:', error);
   });

   TicketListener.listen()

   app.use('/ticketsTest/auth', auth);
   app.use('/ticketsTest/tickets', tickets);
   app.use('/ticketsTest/users', users);

   app.use('/ticketsTest/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });

}




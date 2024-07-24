# React + Vite + Node.js Service Ticket System

This project is a full-featured service ticket system that allows customers to create service tickets and engage in a conversation with customer service representatives. The system also supports real-time notifications and email-based replies, enhancing customer support efficiency and responsiveness.

Features
Service Ticket Creation: Customers can create service tickets to report issues or request support.
Customer Service Replies: Customer service representatives can reply to customer tickets.
Email Integration: Customers can reply to tickets directly via email.
Real-Time Notifications: The system uses sockets to notify customers of new replies in real-time.
Technology Stack
This project leverages the following technologies:

React: A JavaScript library for building user interfaces.
Vite: A build tool that provides a fast development environment.
Node.js: A JavaScript runtime for server-side programming.
Express: A web application framework for Node.js.
MongoDB: A NoSQL database for storing ticket data.
Socket.io: A library for enabling real-time, bidirectional communication.
Getting Started
Prerequisites
Node.js (v14.x or higher)
npm (v6.x or higher) or yarn (v1.x or higher)
MongoDB
Installation
Clone the repository:

download the project;

# For the frontend
cd client
npm install

Set up environment variables:
Create a .env file in the backend directory and add the following:

VITE_BASE_URL='http://localhost:3000'

# For the backend
cd ../server
npm install

Set up environment variables:
Create a .env file in the backend directory and add the following:

SECRET_WORD="my_tickets_project"
PORT="3000"
EMAIL_USER="ticketstest@gmail.com"
EMAIL_PASSWORD=eherr979erhereerh


Run the servers:
# In the backend directory
npm start

# In the frontend directory
cd ../frontend
npm run dev


Plugins
This project uses the following official Vite plugins:

@vitejs/plugin-react: Uses Babel for Fast Refresh.
@vitejs/plugin-react-swc: Uses SWC for Fast Refresh.

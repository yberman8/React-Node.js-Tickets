import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../views/loginPage';
import UsersPage from '../views/usersPage';
import TicketsListPage from '../views/ticketsListPage';
import TicketPage from '../views/ticketPage';
import NewTicketPage from '../views/newTicketPage';

const AppRoutes = () => {

  // const LoginRoute = ({ children }) => {
  //   setShowNavBar(false);
  //   return Auth.checkAuth() ? <Navigate to="/tickets" /> : children;
  // };


  return (
        <Routes>
          <Route
            path="/"
            element={
                <TicketsListPage />
            }
          />
          <Route
            path="/tickets"
            element={
                <TicketsListPage />
            }
          />
          <Route
            path="/ticket/:id"
            element={
                <TicketPage />
            }
          />
          <Route
            path="/login"
            element={
              // <LoginRoute>
                <LoginPage />
              // </LoginRoute>
            }
          />
          <Route
            path="/users"
            element={
                <UsersPage />
            }
          />
          <Route
            path="/new"
            element={
                <NewTicketPage />
            }
          />
        </Routes>
  );
};

export default AppRoutes;

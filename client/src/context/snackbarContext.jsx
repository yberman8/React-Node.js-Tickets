import React, { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  const showSnackBar = (message, color) => {
    setSnackbarText(message);
    setSnackbarColor(color);
    setSnackbar(true);
  };

  const closeSnackbar = () => setSnackbar(false);

  return (
    <SnackbarContext.Provider value={{ showSnackBar, closeSnackbar, snackbar, snackbarText, snackbarColor }}>
      {children}
    </SnackbarContext.Provider>
  );
};

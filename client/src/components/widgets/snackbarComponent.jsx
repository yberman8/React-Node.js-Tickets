import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useSnackbar } from '../../context/snackbarContext'; // adjust the import path as needed

const SnackbarComponent = () => {
  const { snackbar, snackbarText, snackbarColor, closeSnackbar } = useSnackbar();

  return (
    <Snackbar
      open={snackbar}
      autoHideDuration={4000}
      onClose={closeSnackbar}
      message={snackbarText}
      ContentProps={{
        style: { backgroundColor: snackbarColor === 'green' ? '#4caf50' : snackbarColor === 'red' ? '#f44336' : '#2196f3' },
      }}
    />
  );
};

export default SnackbarComponent;

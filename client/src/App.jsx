import './App.css';
import React from 'react';
import AppRoutes from './router/index';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import SnackbarComponent from './components/widgets/snackbarComponent';
import { SnackbarProvider } from './context/snackbarContext'; // adjust the import path as needed
import { SearchProvider } from './context/searchContext'; // Adjust the import path as needed
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, } from './context/authContext'; // Adjust the import path as needed
import { SocketProvider, } from './context/socketContext'; // Adjust the import path as needed
import NavBar from './components/widgets/navBar';

// Create RTL cache
const cacheRtl = createCache({
  key: 'mui-rtl',
  stylisPlugins: [rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl', // Set the direction to right-to-left
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

// class App extends React.Component {
function App() {

  // render() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <SearchProvider>
            <SnackbarProvider>
              <SocketProvider>
              <SnackbarComponent />
              {/* <Router basename="/ticketsTest"> */}
              <Router>
                <AuthProvider>
                  <NavBar/>
                  <AppRoutes/>
                </AuthProvider>
              </Router>
              </SocketProvider>
            </SnackbarProvider>
          </SearchProvider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
// }

export default App;

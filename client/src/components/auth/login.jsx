import React, { useState, useRef, useEffect } from 'react';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { login, vertifyByEmail } from '../../services/api.service';
import { useSnackbar } from '../../context/snackbarContext'; // adjust the import path as needed
import { useAuth } from '../../context/authContext'; // Adjust the import path as needed
import Auth from '../../services/auth.service'; // adjust the import path as needed
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import './login.css';



const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailCode, setemailCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [progressShow, setProgressShow] = useState(false);
  const formRef = useRef(null);
  const otpFieldRef = useRef(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { showSnackBar } = useSnackbar();
  const { setIsAdmin, isAuth } = useAuth();
  const navigate = useNavigate();
  // const {loginAuth} = useAuth();

  const validateForm = () => {
    let isValid = true;
    if (email === '') {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }
    if (password === '') {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    return isValid;
  };

  useEffect(() => {
    if(isAuth()){
      return navigate('/tickets');
    }
  }, []);

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        setProgressShow(true);
        const JSONBody = JSON.stringify({ email, password });
        const response = await login(JSONBody);
        setProgressShow(false);
        showSnackBar('אימייל אימות נשלח בהצלחה!', 'green');
        setCodeSent(true);
        setTimeout(() => {
          otpFieldRef.current.focus();
        }, 200);
      } catch (error) {
        showSnackBar('Error Login: ' + error, 'red');
        setProgressShow(false);
      }
    }
  };

  const emailVerify = async () => {
    try {
      setProgressShow(true);
      const JSONBody = JSON.stringify({ email, emailCode });
      const response = await vertifyByEmail(JSONBody);
      setProgressShow(false);
      showSnackBar("התחברת בהצלחה!", "green");
      // await loginAuth(response.data.token);
      localStorage.setItem('token', response.data.token);
      if (Auth.getUserRole() === "admin") {
        setIsAdmin(true);
      }else{
        setIsAdmin(false);
      }
        navigate('/tickets'); // Programmatic navigation
    } catch (error) {
      showSnackBar("Error Login: " + error, "red");
      setProgressShow(false);
    }
  }

  return (
    <Container className="container">
      <Grid container justifyContent="center" className="mt-10">
        <Grid item xs={12} sm={8} md={6} lg={6} className="card borderSt">
          <Card elevation={4} >
            <img
              src={logo}
              alt="Logo"
              className="logo"
              style={{ width: codeSent ? '60%' : '40%' }}
            />
            <CardContent>
              {!codeSent ? (
                <form ref={formRef}>
                  <TextField
                    className="textField"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="אימייל"
                    type="email"
                    error={emailError}
                    fullWidth
                    required
                    helperText={emailError ? 'אימייל נדרש' : ''}
                  />
                  <TextField
                    className="textField"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="סיסמה"
                    type="password"
                    fullWidth
                    required
                    error={passwordError}
                    helperText={passwordError ? 'סיסמה נדרש' : ''}
                  />
                  <Typography
                    variant="body2"
                    className="link"
                    onClick={() => console.log('Forgot password')}
                  >
                    שכחת סיסמה?
                  </Typography>
                  <CardActions className="justify-center">
                    <Button
                      onClick={handleLogin}
                      className="button"
                      style={{ backgroundColor: '#0d2c6d' }} // Use inline styles for custom colors
                      variant="contained"
                      fullWidth
                    >
                      התחבר
                    </Button>
                  </CardActions>
                  {progressShow && (
                    <Box display="flex" justifyContent="center" my={5}>
                      <CircularProgress color="primary" />
                    </Box>
                  )}
                </form>
              ) : (
                <form ref={formRef}>
                  <TextField
                    className="textField"
                    value={emailCode}
                    onChange={(e) => setemailCode(e.target.value)}
                    label="קוד אימות"
                    type="text"
                    fullWidth
                    inputRef={otpFieldRef}
                    required
                  />
                  <CardActions className="justify-center">
                    <Button
                      onClick={emailVerify}
                      className="button"
                      style={{ backgroundColor: '#0d2c6d' }} // Use inline styles for custom colors
                      variant="contained"
                      fullWidth
                    >
                      אימות קוד
                    </Button>
                  </CardActions>
                  {progressShow && (
                    <Box display="flex" justifyContent="center" my={5}>
                      <CircularProgress color="primary" />
                    </Box>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginComponent;
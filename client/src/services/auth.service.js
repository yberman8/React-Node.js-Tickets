import { jwtDecode } from "jwt-decode";


class Auth {
  constructor() {
  }

 static getUserRole(){
  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage) {
    let decodedToken = jwtDecode(tokenFromStorage);
    return decodedToken['_role'];
  } else {
    return false;
  }
 }

 static getUserId(){
  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage) {
    let decodedToken = jwtDecode(tokenFromStorage);
    return decodedToken['_id'];
  } else {
    return false;
  }
 }

 static getUserName(){
  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage) {
    let decodedToken = jwtDecode(tokenFromStorage);
    return decodedToken['_name'];
  } else {
    return false;
  }
 }

 static getUserEmail(){
  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage) {
    let decodedToken = jwtDecode(tokenFromStorage);
    return decodedToken['_email'];
  } else {
    return false;
  }
 }

}

export default Auth;
import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BASE_URL); // Adjust the URL to your server
        setSocket(newSocket);    
        return () => newSocket.close();
      }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

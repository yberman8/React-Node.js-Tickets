import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Paper, Typography, Grid, Pagination, Stack, Box, Divider } from '@mui/material';
import { getAllTickets } from '../../services/api.service';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../context/snackbarContext'; // adjust the import path as needed
import { useSearch } from '../../context/searchContext'; // Adjust the import path as needed
import { useAuth } from '../../context/authContext'; // Adjust the import path as needed
import Auth from '../../services/auth.service'; // adjust the import path as needed
import { useSocket } from '../../context/socketContext'; // Adjust the import path as needed

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [progressShow, setProgressShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page
  const { showSnackBar } = useSnackbar();
  const { searchQuery } = useSearch();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { socket } = useSocket();

  const getTicketsLIst = async () => {
    if (isAuth()) {
      setProgressShow(true);
      try {
        const response = await getAllTickets();
        setProgressShow(false);
        setTickets(response.data ? response.data : []);
        console.log(response.data);
      } catch (error) {
        setProgressShow(false);
        showSnackBar('Error get tickets list: ' + error, 'red');
      }
    }
  };
  useEffect(() => {
    getTicketsLIst();
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("socket is connected");
      // Join the appropriate room
      socket.emit('joinRoom', { token: localStorage.getItem('token') });

      socket.on('newUserReply', ({ ticketId, newResponse, subject }) => {
        console.log(1111);
        console.log(newResponse);
        updateTicketReplay(ticketId, newResponse, subject);
      });
      socket.on('newAdminReply', ({ ticketId, newResponse, subject }) => {
        console.log(222222);
        updateTicketReplay(ticketId, newResponse, subject);
      });
      socket.on('newUserTicket', ({ ticketCreated }) => {
        console.log(33333);
        setTickets((prevTickets) => {
          const currentTickets = [...prevTickets]; // create a copy of the previous state
          currentTickets.unshift(ticketCreated); // push the new ticket into the copy
          return currentTickets; // return the new array as the new state
        });
      });
      return () => {
        socket.off('newUserReply');
        socket.off('newAdminReply');
        socket.off('newUserTicket');
      };
    }
  }, [socket]);

  const updateTicketReplay = (ticketId, newResponse, subject) => {
    // Update the ticket in the tickets list
    setTickets(prevTickets => {
      return prevTickets.map(ticket => {
        if (ticket._id === ticketId) {
          // Create a new ticket object with the updated responses
          return {
            ...ticket,
            responses: [...ticket.responses, newResponse],
          };
        }
        return ticket;
      });
    });
    showSnackBar('יש לך תגובה חדשה לפנייה: ' + subject, 'blue');
  };

  const isQueryInTicket = (ticket, query) => {
    const queryLower = query.toLowerCase();
    return Object.values(ticket).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(queryLower)
    );
  };

  // Compute the filtered tickets based on the search query
  const filteredTickets = tickets.filter(ticket => isQueryInTicket(ticket, searchQuery));

  // Calculate the current tickets to display based on pagination
  const indexOfLastTicket = currentPage * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const setBackColor = (ticket) => {
    return ticket.responses[ticket.responses.length - 1].read_at === null &&
      ticket.responses[ticket.responses.length - 1].responder_id.role !== Auth.getUserRole()
      ? 'rgba(34, 90, 211, 0.15)' : ticket.status === 'close' ? 'rgba(105, 99, 99, 0.15)' : 'white';
  };


  return (
    <Container>
      {Auth.getUserRole() !== 'admin' && <Button component={Link} to="/new" variant="contained" sx={{ marginBottom: 2 }}>
        פנייה חדשה
      </Button>}
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          רשימת פניות
        </Typography>
        <Divider />
        {tickets[0] && currentTickets.map((ticket) => (
          <Box className="divider"
            key={ticket._id}
            onClick={() => navigate(`/ticket/${ticket._id}`)}
            sx={{ padding: 1, marginBottom: 1, cursor: 'pointer', backgroundColor: setBackColor(ticket) }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8} md={8} lg={10}>
                <Typography className="subject">{ticket.subject}</Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ padding: 0.5, backgroundColor: 'rgba(168, 165, 165, 0.685)', fontWeight: 'bold', borderRadius: '5px' }}>
                    {"#" + ticket.integer_id}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            {ticket.status !== 'close' ? (
              <Typography variant="caption" color="textSecondary">
                תגובה אחרונה ע"י <span style={{ fontWeight: 'bold' }}>{ticket.responses[ticket.responses.length - 1].responder_id.name}</span>
                <span>{" בתאריך " + new Date(ticket.responses[ticket.responses.length - 1].createdAt).toLocaleString()}</span>
              </Typography>
            ) : (
              <Typography variant="caption" color="black">
                הפנייה נסגרה
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8} md={8} lg={10}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%' }}
                >
                  {ticket.responses[ticket.responses.length - 1].message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2} style={{ display: 'flex', justifyContent: "flex-end" }} >
                <Typography variant="caption" color="textSecondary">
                  {new Date(ticket.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Paper>
      <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
        <Pagination
          count={Math.ceil(tickets.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </Container>
  );

};

export default TicketList;


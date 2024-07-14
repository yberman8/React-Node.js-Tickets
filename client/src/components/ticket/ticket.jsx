import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Divider, CircularProgress, Container, Card, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { replayToMessage, getTicketMessages, markAsRead, closeTicket } from '../../services/api.service';
import { useSnackbar } from '../../context/snackbarContext'; // adjust the import path as needed
import { useAuth } from '../../context/authContext'; // Adjust the import path as needed
import AlertDialog from '../widgets/alertDialog'; // Adjust the import path as needed
import Auth from '../../services/auth.service'; // adjust the import path as needed
import { useSocket } from '../../context/socketContext'; // Adjust the import path as needed

const TicketMessageComponent = () => {
  const { id } = useParams();
  const [reply, setReply] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [ticket, setTicket] = useState();
  const [alertDialog, setAlertDialog] = useState(false);
  const [progressShow, setProgressShow] = useState(false);
  const [ticketToClose, setTicketToCLose] = useState();
  const { showSnackBar } = useSnackbar();
  const { isAuth } = useAuth();
  const { socket } = useSocket();

  const getTicketMessagesList = async () => {
    if (isAuth()) {
      try {
        setProgressShow(true);
        console.log(11111);
        console.log(id);
        const params = { ticketId: id }; // Rename ticketId to id
        const response = await getTicketMessages(params);
        setProgressShow(false);
        setTicket(response.data);
        setAllMessages(response.data.responses);
        handleMarkAsRead(response.data, params);
      } catch (error) {
        showSnackBar('Error get ticket messages: ' + error, 'red');
      }
    }
  };

  const handleMarkAsRead = async (ticketArg, params) => {
    if (isAuth()) {
      try {
        const responses = ticketArg.responses;
        console.log(responses);
        const lastResponse = responses[responses.length - 1];
        if (lastResponse.read_at === null) {
          markAsRead(params);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleReplySubmit = async () => {
    if (isAuth()) {
      if (reply.trim() !== '') {
        try {
          setProgressShow(true);
          const JSONBody = JSON.stringify({ ticketId: id, newMessage: reply });
          const response = await replayToMessage(JSONBody);
          setProgressShow(false);
          console.log(response.data);
          setAllMessages([...allMessages, response.data]);
          setReply('');
          showSnackBar('התגובה נשלחה בהצלחה!', 'green');
        } catch (error) {
          setProgressShow(false);
          showSnackBar('Error replay message: ' + error, 'red');
        }
      }
    }
  };

  const handleCloseTicket = async (ticket) => {
    if (isAuth()) {
      try {
        console.log("close ticket started");
        const params = { ticketId: ticket._id };
        const response = await closeTicket(params);
        setTicket({ ...ticket, status: "close" });
        setAlertDialog(false);
        showSnackBar('הפנייה נסגרה בהצלחה', 'green');
      } catch (error) {
        console.log(error);
        showSnackBar('Error close ticket: ' + error, 'red');
      }
    }
  };

  useEffect(() => {
    getTicketMessagesList();
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("socket is connected");

      // Join the appropriate room
      socket.emit('joinRoom', { token: localStorage.getItem('token') });

      socket.on('newUserReply', ({ ticketId, newResponse, subject }) => {
        console.log(1111);
        if (ticketId === id) {
          setAllMessages((prevMessages) => {
            const currentMessagess = [...prevMessages]; // create a copy of the previous state
            currentMessagess.push(newResponse); // push the new ticket into the copy
            return currentMessagess; // return the new array as the new state
          });
          showSnackBar('יש לך תגובה חדשה', 'blue');
        }
      });
      socket.on('newAdminReply', ({ ticketId, newResponse, subject }) => {
        console.log(222222);
        if (ticketId === id) {
          setAllMessages((prevMessages) => {
            const currentMessagess = [...prevMessages]; // create a copy of the previous state
            currentMessagess.push(newResponse); // push the new ticket into the copy
            return currentMessagess; // return the new array as the new state
          });
          showSnackBar('יש לך תגובה חדשה', 'blue');
        }
      });
      return () => {
        socket.off('newUserReplye');
        socket.off('newAdminReply');
      };
    }
  }, [socket]);

  return (
    <Container maxWidth="xl">

      <Box sx={{ padding: 2 }}>
        <div style={{
          width: "100%", height: "40px", backgroundColor: "rgb(218, 225, 235)", marginBottom: 2, display: "flex",
        }}>
          <div style={{ justifyContent: "space-between", alignItems: "center", display: "flex", width: "100%", padding: "0 10px" }}>
            <span>נושא פנייה: {ticket && ticket?.subject}</span>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ padding: 0.5, backgroundColor: 'rgba(168, 165, 165, 0.685)', fontWeight: 'bold', borderRadius: '5px' }}>
              {ticket && "#" + ticket.integer_id}
            </Typography>
          </div>
        </div>
        {progressShow && (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
          </div>
        )}
        <Typography variant="h6" gutterBottom>
          הודעות
        </Typography>
        {allMessages &&  allMessages.map((message) => (
          <Card key={message._id} sx={{ padding: 2, marginBottom: 2 }}>
            <Grid container>
              <Grid item xs={12} sm={8} md={8} lg={10}>
                <Typography className="subject">{message.responder_id.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2} style={{ display: 'flex', justifyContent: "flex-end" }}>
                <Typography className="subject">
                  {new Date(message.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ marginBottom: 2 }} />
            <Typography variant="body1">{message.message}</Typography>
          </Card>
        ))}
        <Divider sx={{ marginY: 2 }} />
        {ticket?.status === 'open' && <Card sx={{ padding: 4 }}>
          <TextField
            label="Reply"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleReplySubmit}
            >
              שלח תגובה
            </Button>
            {Auth.getUserRole() === 'user' && <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={() => { setAlertDialog(true); setTicketToCLose(ticket) }}
            >
              סגור פנייה
            </Button>}
          </div>

        </Card>}
      </Box>
      {alertDialog && <AlertDialog open={alertDialog} setOpen={setAlertDialog} item={ticketToClose}
        handleAgree={(item) => handleCloseTicket(item)} message={'האם אתה בטוח שברצונך לסגור את הפנייה?'} />}
    </Container>
  );
};

export default TicketMessageComponent;

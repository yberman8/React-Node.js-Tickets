import React, { useState } from 'react';
import { Container, TextField, Button, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../services/api.service';
import { useSnackbar } from '../../context/snackbarContext'; // adjust the import path as needed
import { useAuth } from '../../context/authContext'; // Adjust the import path as needed

const NewTicket = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [progressShow, setProgressShow] = useState(false);
    const { showSnackBar } = useSnackbar();
    const navigate = useNavigate();
    const {isAuth} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !message) {
            setError('Both fields are required');
            return;
        }

        if (isAuth()) {
        try {
            setError('');
            setProgressShow(true);
            const JSONBody = JSON.stringify({ subject, message });
            const response = await createTicket(JSONBody);
            setProgressShow(false);
            showSnackBar('הפנייה נוצרה בהצלחה', 'green');
            setTimeout(() => {
                navigate('/tickets'); // Programmatic navigation
            }, 600);
        } catch (err) {
            setProgressShow(false);
            showSnackBar('create ticket Error: ' + err.message, 'red');
        }
    }
    };

    return (
        <Container maxWidth="lg">
            <Card sx={{ mt: 5, padding: 4 }}>
                <h2>פתח פנייה חדשה</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="נושא"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="תוכן הפנייה"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        שלח
                    </Button>
                </form>
            </Card>
        </Container>
    );
};

export default NewTicket;

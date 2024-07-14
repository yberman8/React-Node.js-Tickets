import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Paper, Typography, Grid, Pagination, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { getAllUsers, switchToUser, deleteUser } from '../../services/api.service';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddEditDialog from './addEditDialog'; // Adjust the import path as needed
import AlertDialog from '../widgets/alertDialog'; // Adjust the import path as needed
import SwitchIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext'; // Adjust the import path as needed
import { useSnackbar } from '../../context/snackbarContext'; // adjust the import path as needed
import Auth from '../../services/auth.service'; // adjust the import path as needed
import { useSearch } from '../../context/searchContext'; // Adjust the import path as needed

const headers = [
    { id: 'index', label: '#' },
    { id: 'name', label: 'שם' },
    { id: 'phone', label: 'טלפון' },
    { id: 'email', label: 'אימייל' },
    { id: 'status', label: 'סטטוס' },
    { id: 'role', label: 'הרשאות' },
    { id: 'actions', label: 'פעולות' }
];

const cellStyles = {
    padding: '6px 16px',
    height: 40
}

export default function UsersList() {

    const [currentPage, setCurrentPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { searchQuery } = useSearch();
    const [progressShow, setProgressShow] = useState(false);
    const [addEditDialog, setAddEditDialog] = useState(false);
    const [alertDialog, setAlertDialog] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({ name: "", phone: "", email: "", role: "", card_id: "" });
    const [itemToDelete, setItemToDelete] = useState({});
    const [formTitle, setFormTitle] = useState("");
    const { showSnackBar } = useSnackbar();
    const { isAdmin, setIsAdmin, isAuth } = useAuth();
    const [rows, setRows] = React.useState([]);
    const navigate = useNavigate();

    const switchToUserAccount = async (item) => {
        if (isAuth()) {
            setProgressShow(true);
            try {
                const role = Auth.getUserRole();
                const token = localStorage.getItem("token");
                if (role === "admin") {
                    localStorage.setItem('tokenAdmin', token);
                } else { return }

                let MyJSON = JSON.stringify({ _id: item._id });
                const response = await switchToUser(MyJSON);
                setProgressShow(false);
                localStorage.setItem('token', response.data.token);
                setIsAdmin(false);
                navigate('/tickets');
            } catch (error) {
                showSnackBar('Error on switch to user account: ' + error, 'red');
            }
        }
    }

    const getUsersLIst = async () => {
        if (isAuth()) {
            setProgressShow(true);
            try {
                const response = await getAllUsers();
                setProgressShow(false);
                setRows(response.data ? response.data : []);
                console.log(response.data);
            } catch (error) {
                setProgressShow(false);
                showSnackBar('Error get users list: ' + error, 'red');
            }
        }
    };

    useEffect(() => {
        getUsersLIst();
    }, []);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleAddOrEdit = (type, item) => {
        let message;
        if (type === "new") {
            setRows([...rows, item]);
            message = "המשתמש נוסף בהצלחה";
        } else {
            setRows(rows.map(user => user._id === item._id ? item : user));
            message = "המשתמש עודכן בהצלחה";
        }
        showSnackBar(message, "green");

    };

    const handleDeleteItem = async (item) => {
        if (isAuth()) {
            setProgressShow(true);
            try {
                await deleteUser({ id: item._id });
                setRows(rows.filter(user => user._id !== item._id));
                setAlertDialog(false);
                showSnackBar("המשתמש נמחק בהצלחה", "green");
            } catch (error) {
                showSnackBar('Error delete item: ' + error, 'red');
            }
        }
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setCurrentPage(0);
    };

    const isQueryInTicket = (user, query) => {
        const queryLower = query.toLowerCase();
        return Object.values(user).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(queryLower)
        );
    };

    // Compute the filtered tickets based on the search query
    const filteredUsers = rows.filter(user => isQueryInTicket(user, searchQuery));

    return (
        <Container maxWidth="xl">

            <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
                <Button component={Link} variant="contained" sx={{ marginBottom: 2 }} onClick={() => { setItemToEdit({}), setFormTitle("הוסף משתמש"), setAddEditDialog(true) }}>
                    משתמש חדש
                </Button>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow className='table-headers'>
                                {headers &&
                                    headers.map((header) => (
                                        <TableCell className='table-headers-span' key={header.id}>{header.label}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers && filteredUsers.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow
                                    key={row._id}
                                >
                                    <TableCell align="center" sx={cellStyles}>{currentPage * rowsPerPage + index + 1}</TableCell>
                                    <TableCell align="center" sx={cellStyles}>{row.name}</TableCell>
                                    <TableCell align="center" sx={cellStyles}>{row.phone}</TableCell>
                                    <TableCell align="center" sx={cellStyles}>{row.email}</TableCell>
                                    <TableCell align="center" sx={cellStyles}>{String(row.status)}</TableCell>
                                    <TableCell align="center" sx={cellStyles}>{row.role}</TableCell>
                                    <TableCell align="center" sx={cellStyles}>
                                        {row.role === 'user' && <IconButton sx={{ marginRight: 1 }} onClick={() => switchToUserAccount(row)}><SwitchIcon /></IconButton>}
                                        <IconButton sx={{ marginRight: 1 }} onClick={() => { setAddEditDialog(true), setFormTitle("ערוך משתמש"), setItemToEdit(row) }}><EditIcon /></IconButton>
                                        {/* <IconButton sx={{ marginRight: 1 }} onClick={() => { setAlertDialog(true), setItemToDelete(row) }}><DeleteIcon /></IconButton> */}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="שורות בעמוד"
                    labelDisplayedRows={
                        ({ from, to, count }) => `${from}–${to} מתוך ${count}`}
                />
            </Paper>
            {addEditDialog && <AddEditDialog open={addEditDialog} setOpen={setAddEditDialog} item={itemToEdit}
                onSave={(type, item) => handleAddOrEdit(type, item)} formTitle={formTitle} />}
            {alertDialog && <AlertDialog open={alertDialog} setOpen={setAlertDialog} item={itemToDelete}
                handleAgree={(item) => handleDeleteItem(item)} message={'האם אתה בטוח שברצונך למחוק את הפריט?'} />}
        </Container>
    );
}

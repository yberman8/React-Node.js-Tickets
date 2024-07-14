import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Grid, TextField, Select, MenuItem, Button, CircularProgress, Snackbar
} from '@mui/material';
import { styled } from '@mui/system';
import { useSnackbar } from '../../context/snackbarContext'; // adjust the import path as needed
import { createUser, editUser } from '../../services/api.service';
import { useAuth } from '../../context/authContext'; // Adjust the import path as needed

const CustomButton = styled(Button)({
    color: '#3F51B5',
    textTransform: 'none',
});

export default function AddEditDialog({ open, setOpen, item, onSave, formTitle }) {

    const [progressShow, setProgressShow] = useState(false);
    const { showSnackBar } = useSnackbar();
    const [itemEdited, setItemEdited] = useState({
        _id: "",
        card_id: "",
        status: null,
        name: "",
        phone: "",
        role: "",
    });
    const [passObj, setPassObj] = useState({ password: "", repeat_password: "" });
    const statusOptions = [{ hebrewName: "פעיל", name: true }, { hebrewName: "לא פעיל", name: false }];
    const roles = [{ hebrewName: "מנהל", name: "admin" }, { hebrewName: "משתמש", name: "user" }];
    const formRef = useRef();
    const { isAdmin, setIsAdmin, isAuth } = useAuth();

    useEffect(() => {
        if (formTitle === "ערוך משתמש") {
            setItemEdited(JSON.parse(JSON.stringify(item)));
        }
    }, [formTitle, item]);

    const handleSaveNewUser = async () => {
        try {

            if (formRef.current.reportValidity()) {
                if (passObj.password.length < 9) {
                    return showSnackBar("הסיסמה חייבת לכלול לפחות 9 תווים", "red");
                }
                if (passObj.password !== passObj.repeat_password) {
                    return showSnackBar("נא לאמת את הסיסמה", "red");
                }
                if (!isIsraeliIdNumber(itemEdited.card_id)) {
                    return showSnackBar("תעודת הזהות אינה תקינה", "red");
                }

                if (isAuth()) {
                    setProgressShow(true);
                    const JSONBody = JSON.stringify({ user: itemEdited, passObj: passObj });
                    const response = await createUser(JSONBody);
                    setProgressShow(false);
                    onSave("new", response.data ? response.data : []);
                    setOpen(false);
                }
            }
        } catch (error) {
            setProgressShow(false);
            showSnackBar('Error get users list: ' + error, 'red');
        }
    }

    const handleSaveEditedUser = async () => {
        if (formRef.current.reportValidity()) {

            if (!isIsraeliIdNumber(itemEdited.card_id)) {
                return showSnackBar("תעודת הזהות אינה תקינה", "red");
            }

            try {
                if (isAuth()) {
                    setProgressShow(true);
                    const JSONBody = JSON.stringify({ user: itemEdited});
                    const response = await editUser(JSONBody);
                    setProgressShow(false);
                    onSave("edit", response.data ? response.data : []);
                    setOpen(false);
                }
            } catch (error) {
                setProgressShow(false);
                showSnackBar("Error edit user: " + error, "red");
            }
        }
    };

    const isIsraeliIdNumber = (id) => {
        id = String(id).trim();
        if (id.length > 9 || isNaN(id)) return false;
        id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
        return Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }) % 10 === 0;
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{formTitle}</DialogTitle>
            <DialogContent>
                <form ref={formRef}>
                    <Grid container spacing={2} sx={{ marginTop: 0 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="שם"
                                value={itemEdited.name}
                                onChange={(e) => setItemEdited({ ...itemEdited, name: e.target.value })}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="ת.ז"
                                type="text"
                                value={itemEdited.card_id}
                                onChange={(e) => setItemEdited({ ...itemEdited, card_id: e.target.value })}
                                required
                                fullWidth
                                inputProps={{ pattern: "\\d*" }} // Accept only numeric input
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="טלפון"
                                type="number"
                                value={itemEdited.phone}
                                onChange={(e) => setItemEdited({ ...itemEdited, phone: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="אימייל"
                                type={"email"}
                                value={itemEdited.email}
                                onChange={(e) => setItemEdited({ ...itemEdited, email: e.target.value })}
                                fullWidth
                                required
                            />
                        </Grid>
                        {formTitle !== 'ערוך משתמש' && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="סיסמה"
                                        type="password"
                                        value={passObj.password}
                                        onChange={(e) => setPassObj({ ...passObj, password: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="אימות סיסמה"
                                        type="password"
                                        value={passObj.repeat_password}
                                        onChange={(e) => setPassObj({ ...passObj, repeat_password: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                value={itemEdited.role}
                                onChange={(e) => setItemEdited({ ...itemEdited, role: e.target.value })}
                                fullWidth
                                select
                                label="הרשאות"
                            >
                                {roles.map(role => (
                                    <MenuItem key={role.name} value={role.name}>
                                        {role.hebrewName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                value={itemEdited.status}
                                onChange={(e) => setItemEdited({ ...itemEdited, status: e.target.value })}
                                fullWidth
                                select
                                label="סטטוס"
                            >
                                {statusOptions.map(status => (
                                    <MenuItem key={status.name} value={status.name}>
                                        {status.hebrewName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </form>
                <Grid container spacing={2} justifyContent="center" style={{ marginTop: 20 }}>
                    <Grid item>
                        <CustomButton onClick={formTitle === 'ערוך משתמש' ? handleSaveEditedUser : handleSaveNewUser}>
                            שמור
                        </CustomButton>
                    </Grid>
                    <Grid item>
                        <CustomButton onClick={handleClose}>
                            ביטול
                        </CustomButton>
                    </Grid>
                </Grid>
                {progressShow && (
                    <Grid container justifyContent="center">
                        <CircularProgress style={{ color: '#3F51B5' }} />
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
}

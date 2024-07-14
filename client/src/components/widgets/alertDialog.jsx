import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, Grid, Button, DialogContentText, DialogActions, CircularProgress
} from '@mui/material';

export default function AlertDialog(props) {
  const { open, setOpen, message } = props;
  const item = JSON.parse(JSON.stringify(props.item));

  const [progressShow, setProgressShow] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    props.handleAgree(item);
    setProgressShow(true);
  };

  React.useEffect(() => {
    console.log(item);
  }, []);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {message}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button onClick={handleAgree} autoFocus>
            אישור
          </Button>
        </DialogActions>
        {progressShow && (
          <Grid container justifyContent="center" sx={{ marginBottom: 2 }}>
            <CircularProgress style={{ color: '#3F51B5' }} />
          </Grid>
        )}
      </Dialog>
    </React.Fragment>
  );
}

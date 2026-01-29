import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type AlertDialogPayload = {
  title: string;
  message: string;
  open: boolean;
  onClose: () => void;
  handleConfirm: () => void;
};

export const AlertDialog = (props: AlertDialogPayload) => {
  const { message, title, open, handleConfirm, onClose } = props;

  const handleClick = () => {
    handleConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Disagree</Button>
        <Button onClick={handleClick} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

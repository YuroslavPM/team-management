import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useGetAllUsers } from "../../api/userController";
import { useNavigate } from "react-router-dom";
import { Grid, Snackbar } from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { userAuthContext } from "../../utils/context/UserContext";

export default function LoginPage() {
  const { setCurrentUser } = userAuthContext();
  const navigate = useNavigate();

  const { data } = useGetAllUsers();
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [showError, setShowError] = useState(false);

  const handleClick = () => {
    const user = data?.find((x) => x.email === email && x.secret === secret);

    if (user) {
      setCurrentUser(user);

      navigate("/");
    } else {
      setShowError(true);
    }
  };

  const handleClose = () => {
    setShowError(false);
  };

  return (
    // <Box
    //   component="form"
    //   sx={{
    //     display: "flex",
    //     flexFlow:"row wrap",
    //     gap: 2,
    //     "& > :not(style)": { m: 1, width: "25ch" },
    //   }}
    //   noValidate
    //   autoComplete="off"
    // >
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <TextField
        id="outlined-controlled"
        label="Email"
        value={email}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setEmail(event.target.value);
        }}
      />
      <TextField
        id="outlined-controlled"
        label="Password"
        type="password"
        value={secret}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setSecret(event.target.value);
        }}
      />
      <Button variant="contained" onClick={handleClick}>
        Login
      </Button>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={showError}
        onClose={handleClose}
        message="Wrong email or password"
        autoHideDuration={6000}
      />
    </Grid>
    // </Box>
  );
}

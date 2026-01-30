import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useGetAllUsers } from "../../api/userController";
import { NavLink, useNavigate } from "react-router-dom";
import { Snackbar, Typography } from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { userAuthContext } from "../../utils/context/UserContext";
import { CommonButton } from "../../components/common/CommonButton";
import { CommonText } from "../../components/common/CommonText";

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
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: 400,
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CommonText text={"Login"} style={""} variant="h2" gutterBottom />
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
        <CommonButton
          text={"Login"}
          style={{ bgcolor: "#2168eb", color: "white" }}
          variant="contained"
          onClick={handleClick}
        />

        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 16 }}>
          <NavLink to="/register">Register here!</NavLink>
        </Typography>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={showError}
          onClose={handleClose}
          message="Wrong email or password"
          autoHideDuration={6000}
        />
      </Box>
    </Box>
  );
}

import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCreateUser } from "../../api/userController";
import { Typography } from "@mui/material";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [secret, setSecret] = useState("");
  const [secretError, setSecretError] = useState("");

  const { mutate } = useCreateUser();

  const handleClick = () => {
    mutate(
      { email, firstName, lastName, secret },
      {
        onSuccess: () => {
          navigate("/login");
        },
      },
    );
  };

  const validate = () => {
    let isValid = true;

    if (!firstName) {
      setFirstNameError("First name is required!");
      isValid = false;
    }
    if (!lastName) {
      setLastNameError("Last name is required!");
      isValid = false;
    }
    if (!email) {
      setEmailError("Email is required!");
      isValid = false;
    }
    if (!secret) {
      setSecretError("Password is required!");
      isValid = false;
    }

    return isValid;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    validate();
  }, [firstName, lastName, email, secret]);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        position: "fixed",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
      noValidate
      autoComplete="off"
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          width: 400,
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h2" gutterBottom>
          Register
        </Typography>

        <TextField
          id="outlined-controlled"
          label="First Name"
          value={firstName}
          error={!!firstNameError}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value) {
              setFirstNameError("");
            } else {
              setFirstNameError("Name is required!");
            }
            setFirstName(event.target.value);
          }}
          helperText={firstNameError}
        />
        <TextField
          id="outlined-controlled"
          label="Last Name"
          value={lastName}
          error={!!lastNameError}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value) {
              setLastNameError("");
            } else {
              setLastNameError("Last name is required!");
            }
            setLastName(event.target.value);
          }}
          helperText={lastNameError}
        />
        <TextField
          id="outlined-controlled"
          label="Email"
          type="email"
          value={email}
          error={!!emailError}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value) {
              setEmailError("");
            } else {
              setEmailError("Email is required!");
            }
            setEmail(event.target.value);
          }}
          helperText={emailError}
        />
        <TextField
          id="outlined-controlled"
          label="Password"
          type="password"
          value={secret}
          error={!!secretError}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value) {
              setSecretError("");
            } else {
              setSecretError("Password is required!");
            }
            setSecret(event.target.value);
          }}
          helperText={secretError}
        />
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={Boolean(
            firstNameError || lastNameError || emailError || secretError,
          )}
        >
          Register
        </Button>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 16 }}>
          <NavLink to="/login">Login here!</NavLink>
        </Typography>
      </Box>
    </Box>
  );
}

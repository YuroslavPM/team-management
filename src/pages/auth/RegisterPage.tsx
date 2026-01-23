import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useCreateUser } from "../../api/userController";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");

  const { mutate } = useCreateUser();

  const handleClick = () => {
    mutate({ email, firstName, lastName, secret });
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        columns: "row",
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-controlled"
        label="First Name"
        value={firstName}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFirstName(event.target.value);
        }}
      />
      <TextField
        id="outlined-controlled"
        label="Last Name"
        value={lastName}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLastName(event.target.value);
        }}
      />
      <TextField
        id="outlined-controlled"
        label="Email"
        type="email"
        value={email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(event.target.value);
        }}
      />
      <TextField
        id="outlined-controlled"
        label="Password"
        type="password"
        value={secret}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSecret(event.target.value);
        }}
      />
      <Button variant="contained" onClick={handleClick}>
        Register
      </Button>
    </Box>
  );
}

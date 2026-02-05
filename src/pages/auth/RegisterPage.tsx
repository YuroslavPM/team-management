import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { NavLink } from "react-router-dom";
import { useCreateUser, useGetAllUsers } from "../../api/userController";
import { Button, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { userAuthContext } from "../../utils/context/UserContext";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  secret: string;
};

export default function RegisterPage() {
  const { data } = useGetAllUsers();
  const { mutate: createUser } = useCreateUser();
  const { setCurrentUser } = userAuthContext();

  const {
    control: register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      secret: "",
    },
  });

  const handleClick = (formData: RegisterForm) => {
    createUser({
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      email: formData?.email,
      secret: formData?.secret,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = data?.find(
      (x) => x.email === formData.email && x.secret === formData.secret,
    );
    if (user) {
      setCurrentUser(user);
    }
    reset();
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit((data) => handleClick(data))}
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
        <Typography variant="h2" gutterBottom>
          Register
        </Typography>

        <Controller
          name="firstName"
          control={register}
          rules={{
            required: "First name is required!",
            validate: (value) =>
              value.length > 2 || "First name must be at least 3 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              error={!!errors.firstName}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={register}
          rules={{
            required: "Last name is required!",
            validate: (value) =>
              value.length > 3 || "Last name must be at least 3 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              error={!!errors.lastName}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.lastName?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={register}
          rules={{
            required: "Email is required!",
            validate: (value) => value.includes("@") || "Invalid email address",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              error={!!errors.email}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.email?.message}
            />
          )}
        />
        <Controller
          name="secret"
          control={register}
          rules={{
            required: "Password is required!",
            validate: (value) =>
              value.length >= 6 || "Password must be at least 6 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              error={!!errors.secret}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.secret?.message}
            />
          )}
        />
        <Button variant="contained" type="submit" disabled={!isValid}>
          Register
        </Button>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 16 }}>
          <NavLink to="/login">Login here!</NavLink>
        </Typography>
      </Box>
    </Box>
  );
}

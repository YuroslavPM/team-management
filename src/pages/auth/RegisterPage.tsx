import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { NavLink, useNavigate } from "react-router-dom";
import { useCreateUser } from "../../api/userController";
import { Button, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { getApiError } from "../../utils/helpers/genericAxiosHelper";

type RegisterForm = {
  first_name: string;
  last_name: string;
  email: string;
  secret: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    mutate: createUser,
    error,
    isError,
  } = useCreateUser(() => {
    navigate("/login");
  });

  const {
    control: register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      secret: "",
    },
  });

  const handleClick = (formData: RegisterForm) => {
    createUser({
      first_name: formData?.first_name,
      last_name: formData?.last_name,
      email: formData?.email,
      secret: formData?.secret,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
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
          name="first_name"
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
              error={!!errors.first_name}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.first_name?.message}
            />
          )}
        />
        <Controller
          name="last_name"
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
              error={!!errors.last_name}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.last_name?.message}
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
        {isError && (
          <Typography color="error">
            {getApiError(error) || "Registration failed"}
          </Typography>
        )}
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

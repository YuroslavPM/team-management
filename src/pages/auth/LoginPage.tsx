import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useLogin } from "../../api/userController";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { CommonText } from "../../components/common/CommonText";
import { Controller, useForm } from "react-hook-form";

type LoginForm = {
  email: string;
  secret: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    mutate: login,
    isError,
    error,
  } = useLogin(() => {
    navigate("/");
  });

  const onSubmit = (formData: LoginForm) => {
    login({
      email: formData.email,
      secret: formData.secret,
    });
    reset();
  };

  const {
    control: control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginForm>({ mode: "onChange" });

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit((data) => onSubmit(data))}
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
        <CommonText
          text={"Login"}
          variant="h2"
          gutterBottom
          value={undefined}
          style={null}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
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
          control={control}
          rules={{
            required: "Password is required!",
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
            {(error as Error).message || "Login failed"}
          </Typography>
        )}
        <Button variant="contained" disabled={!isValid} type="submit">
          Login
        </Button>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 16 }}>
          <NavLink to="/register">Register here!</NavLink>
        </Typography>
      </Box>
    </Box>
  );
}

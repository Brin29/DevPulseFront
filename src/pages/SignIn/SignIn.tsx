import { Button, Box, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import type { SignInRequest } from "../../models/auth.model";
import { Input, InputType } from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { authUserMutations } from "../../hooks/auth.hook";

export const SignIn = () => {
  const { login } = authUserMutations();

  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignInRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInRequest) => {
    const payload = {
      ...data,
    };

    login.mutate(payload, {
      onSuccess: (response: any) => {
        navigate("/dashboard");
        localStorage.setItem("authMe", JSON.stringify(response));
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
  };

  return (
    <Box className="form-container">
      <Typography component="h2">Sign in</Typography>
      <Typography>
        Don't have an account?{" "}
        <Link
          onClick={() => {
            navigate("/request-code");
          }}
        >
          Sign Up
        </Link>
      </Typography>
      <Box
        className="form-container"
        noValidate
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          control={control}
          type={InputType.TEXT}
          label="Email"
          name="email"
          disabled={false}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email",
            },
          }}
        />

        <Input
          control={control}
          type={InputType.PASSWORD}
          label="Password"
          name="password"
          disabled={false}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          }}
        />
        <Typography>
          <Link
            onClick={() => {
              navigate("/sign-up");
            }}
          >
            Forgot password?
          </Link>
        </Typography>
        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </Box>
    </Box>
  );
};

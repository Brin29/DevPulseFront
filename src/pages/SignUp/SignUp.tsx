import { Button, Box, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import type { SignUpRequest } from "../../models/auth.model";
import { Input, InputType } from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { authUserMutations } from "../../hooks/auth.hook";

export const SignUp = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("signup_email") as string;
  const verificationToken = localStorage.getItem(
    "verification_token",
  ) as string;

  const { register } = authUserMutations();

  if (!email) {
    navigate("/request-code");
  }

  const { handleSubmit, control } = useForm<SignUpRequest>({
    defaultValues: {
      email: email || "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpRequest) => {
    register.mutate(
      { data, verificationToken },
      {
        onSuccess: (response: any) => {
          navigate("/dashboard");
          localStorage.setItem("authMe", JSON.stringify(response));
        },
        onError: (error: any) => {
          console.log(error);
        },
      },
    );

    // const response = await signUp(payload, verificationToken);
    // signInAdapter(response);
  };

  return (
    <Box className="form-container">
      <Typography component="h2">Sign up</Typography>
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
          disabled={true}
          // rules={{
          //   required: "Password is required",
          //   minLength: {
          //     value: 6,
          //     message: "Minimum 6 characters",
          //   },
          // }}
        />

        <Input
          control={control}
          type={InputType.TEXT}
          label="First Name"
          name="firstName"
          disabled={false}
          // rules={{
          //   required: "Password is required",
          //   minLength: {
          //     value: 6,
          //     message: "Minimum 6 characters",
          //   },
          // }}
        />

        <Input
          control={control}
          type={InputType.TEXT}
          label="Last Name"
          name="lastName"
          disabled={false}
          // rules={{
          //   required: "Password is required",
          //   minLength: {
          //     value: 6,
          //     message: "Minimum 6 characters",
          //   },
          // }}
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
          Sign up
        </Button>
      </Box>
    </Box>
  );
};

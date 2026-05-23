import { Button, Box, Typography, Link } from "@mui/material";
import { checkEmail } from "../../services/auth.service";
import { useForm } from "react-hook-form";
import type { CheckEmailRequest } from "../../models/auth.model";
import { Input, InputType } from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { CheckEmailAdapter } from "../../adapters";
import { authUserMutations } from "../../hooks/auth.hook";

export const RequestCode = () => {
  const navigate = useNavigate();

  const { createCode, createMagicLink } = authUserMutations();

  const { handleSubmit, control } = useForm<CheckEmailRequest>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: CheckEmailRequest) => {
    const payload = {
      ...data,
    };

    const response = await checkEmail(payload);
    const checkEmailResponse = CheckEmailAdapter(response);

    if (checkEmailResponse.exists) {
      createMagicLink.mutate(payload, {
        onSuccess: () => {
          navigate("/detected-account");
        },
        onError: (error) => {
          console.log("Ocurrio un error:" + error);
        },
      });
    } else {
      createCode.mutate(payload, {
        onSuccess: () => {
          const userEmail = data.email;

          if (userEmail) {
            localStorage.setItem("signup_email", userEmail);
          }

          navigate("/verify-code");
        },
        onError: (error) => {
          console.log("Ocurrio un error:" + error);
        },
      });
    }
  };

  return (
    <Box className="form-container">
      <Typography component="h2">Sign up</Typography>
      <Typography>
        Already have an account?{" "}
        <Link
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          Sign In
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

        <Button className="w-full" type="submit">
          Sign up
        </Button>
      </Box>
    </Box>
  );
};

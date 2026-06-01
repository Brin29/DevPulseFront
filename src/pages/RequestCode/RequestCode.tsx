import { Button, Box, Typography, Link, Avatar } from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";
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
          const userEmail = payload.email;

          localStorage.setItem("signup_email", userEmail);
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
      <Avatar className="form-avatar">
        <EmailOutlined />
      </Avatar>
      <Typography component="h2">Crear cuenta</Typography>
      <Typography className="form-subtitle">
        Ingresa tu correo electrónico para comenzar
      </Typography>
      <Box
        className="form-body"
        noValidate
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          control={control}
          type={InputType.TEXT}
          label="Correo electrónico"
          name="email"
          disabled={false}
          rules={{
            required: "El correo es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Correo inválido",
            },
          }}
        />

        <Button className="w-full" type="submit" size="large">
          Continuar
        </Button>
        <Box className="form-footer">
          <Typography>
            ¿Ya tienes cuenta?{" "}
            <Link
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Iniciar sesión
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

import { Button, Box, Typography, Link, Avatar } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import type { SignInRequest } from "../../models/auth.model";
import { Input, InputType } from "../../components/Input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authUserMutations } from "../../hooks/auth.hook";
import { useState } from "react";
import { Modal } from "../../components/Modals/Modal";
import type { ApiResponse, ApiResponseError } from "../../models/api.model";

export const SignIn = () => {
  const { login } = authUserMutations();
  const [searchParams] = useSearchParams();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignInRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirect =
    searchParams.get("redirect") ?? localStorage.getItem("auth_redirect");

  const onSubmit = async (data: SignInRequest) => {
    const payload = {
      ...data,
    };

    login.mutate(payload, {
      onSuccess: (response: ApiResponse) => {
        navigate(redirect || "/dashboard");
        localStorage.setItem("authMe", JSON.stringify(response));
        localStorage.removeItem("auth_redirect");
      },
      onError: (error: ApiResponseError) => {
        setErrorModal(true);
        setErrorMessage(error?.response?.data?.error);
      },
    });
  };

  return (
    <Box className="form-container">
      <Avatar className="form-avatar">
        <LockOutlined />
      </Avatar>
      <Typography component="h2">Iniciar sesión</Typography>
      <Typography className="form-subtitle">
        Ingresa tus credenciales para acceder a tu cuenta
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

        <Input
          control={control}
          type={InputType.PASSWORD}
          label="Contraseña"
          name="password"
          disabled={false}
          rules={{
            required: "La contraseña es obligatoria",
            minLength: {
              value: 6,
              message: "Mínimo 6 caracteres",
            },
          }}
        />
        {/* <Box className="form-links">
          <Link
            onClick={() => {
              navigate("/sign-up");
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box> */}
        <Button className="w-full" type="submit" size="large">
          Iniciar sesión
        </Button>
        <Box className="form-footer">
          <Typography>
            ¿No tienes cuenta?{" "}
            <Link
              onClick={() => {
                navigate("/request-code");
              }}
            >
              Registrarse
            </Link>
          </Typography>
        </Box>
      </Box>

      {errorModal && (
        <Modal
          title="Ocurrio un error"
          open={errorModal}
          onClose={() => setErrorModal(false)}
        >
          <Typography>{errorMessage}</Typography>
        </Modal>
      )}
    </Box>
  );
};

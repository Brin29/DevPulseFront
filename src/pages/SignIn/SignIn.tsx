import { Button, Box, Typography, Link, Avatar } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import type { SignInRequest } from "../../models/auth.model";
import { Input, InputType } from "../../components/Input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authUserMutations } from "../../hooks/auth.hook";
import { useState } from "react";
import { Modal } from "../../components/Modals/Modal";
import type { ApiResponseError } from "../../models/api.model";
import GithubIcon from "../../assets/githubIcon";
import GoogleIcon from "../../assets/googleIcon";

export const SignIn = () => {
  const { login } = authUserMutations();
  const [searchParams] = useSearchParams();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleClick = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleGithubClick = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

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
      onSuccess: (response: any) => {
        localStorage.setItem(
          "authMe",
          JSON.stringify({
            access_token: response.access_token,
            refresh_token: response.refresh_token,
          }),
        );
        localStorage.setItem("meUser", JSON.stringify(response.user));
        navigate(redirect || "/dashboard");

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
        <Button variant="contained" className="w-full" type="submit" size="large">
          Iniciar sesión
        </Button>

      <Button
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
        variant="outlined"
        onClick={handleGoogleClick}>
        <GoogleIcon/>
        Continuar con Google
      </Button>

      <Button
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
        variant="outlined"
        onClick={handleGithubClick}
      >
        <GithubIcon/>
        Continuar con Github
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

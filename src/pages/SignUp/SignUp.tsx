import { Button, Box, Typography, Link, Avatar } from "@mui/material";
import { PersonAddOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import type { SignUpRequest } from "../../models/auth.model";
import { Input, InputType } from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { authUserMutations } from "../../hooks/auth.hook";
import type { ApiResponseError } from "../../models/api.model";
import { useState } from "react";
import { Modal } from "../../components/Modals/Modal";

export const SignUp = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("signup_email") as string;
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
          localStorage.setItem("authMe",  JSON.stringify({ access_token: response.access_token, refresh_token: response.refresh_token }))
        },
        onError: (error: ApiResponseError) => {
          setErrorModal(true);
          setErrorMessage(error?.response?.data?.error);
        },
      },
    );
  };

  return (
    <Box className="form-container">
      <Avatar className="form-avatar">
        <PersonAddOutlined />
      </Avatar>
      <Typography component="h2">Crear cuenta</Typography>
      <Typography className="form-subtitle">
        Completa tus datos para registrarte
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
          disabled={true}
        />

        <Input
          control={control}
          type={InputType.TEXT}
          label="Nombre"
          name="firstName"
          disabled={false}
          rules={{
            required: "El nombre es obligatorio",
          }}
        />

        <Input
          control={control}
          type={InputType.TEXT}
          label="Apellido"
          name="lastName"
          disabled={false}
          rules={{
            required: "El apellido es obligatorio",
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
        <Button variant="contained" className="w-full" type="submit" size="large">
          Crear cuenta
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

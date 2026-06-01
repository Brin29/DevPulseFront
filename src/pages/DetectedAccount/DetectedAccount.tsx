import { Box, Typography, Avatar } from "@mui/material";
import { MailOutlined } from "@mui/icons-material";

export const DetectedAccount = () => {
  const email = localStorage.getItem("signup_email") ?? "";

  return (
    <Box className="form-container detected-account-container">
      <Avatar className="form-avatar">
        <MailOutlined />
      </Avatar>
      <Typography component="h2">Cuenta existente</Typography>
      <Typography className="form-subtitle">
        Detectamos que ya tienes una cuenta registrada con este correo.
      </Typography>
      <Box className="form-body">
        <Typography>
          Por motivos de seguridad, hemos enviado un enlace a{" "}
          <strong>{email}</strong> para que inicies sesión de forma segura.
        </Typography>
      </Box>
    </Box>
  );
};

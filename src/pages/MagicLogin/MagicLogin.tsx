import { Box, Typography, Avatar, CircularProgress } from "@mui/material";
import { LinkOutlined } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authUserMutations } from "../../hooks/auth.hook";
import { useEffect } from "react";

export const MagicLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const { verfifyMagicLink } = authUserMutations();

  useEffect(() => {
    if (!token) {
      return;
    }

    const payload = {
      magic_token: token
    }

    verfifyMagicLink.mutate((payload), {
      onSuccess: (data: any) => {
        localStorage.setItem("authMe", JSON.stringify(data))
        navigate("/dashboard")
      },
      onError: (error) => {
        console.log("Ocurrio un error:" + error)
        navigate("/sign-in")
      }
    });
  }, [token]);

  return (
    <Box className="form-container magic-login-container">
      <Avatar className="form-avatar">
        <LinkOutlined />
      </Avatar>
      <Typography component="h2">Iniciando sesión</Typography>
      <CircularProgress sx={{ mt: 1, mb: 1, color: "primary.main" }} />
      <Typography className="form-subtitle">
        Verificando tu enlace mágico, por favor espera...
      </Typography>
    </Box>
  );
};

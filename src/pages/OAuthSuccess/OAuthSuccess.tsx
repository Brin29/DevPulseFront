import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserProfile } from "../../hooks/auth.hook";

export const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data, isLoading, isError, error: queryError } = getUserProfile();

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  useEffect(() => {
    if (!accessToken || !refreshToken || isError) {
      navigate("/sign-in", { replace: true });
      return;
    }

    const redirect =
      searchParams.get("redirect") ?? localStorage.getItem("auth_redirect");

    localStorage.setItem(
      "authMe",
      JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
    );

    localStorage.setItem("meUser", JSON.stringify(data?.user));

    if (data) {
      navigate(decodeURIComponent(redirect!!) || "/dashboard", { replace: true });
    }
  }, [accessToken, refreshToken, navigate, data]);

  return (
    <Box className="form-container oauth-success-container">
      <Avatar className="form-avatar">
        <Google />
      </Avatar>
      <Typography component="h2">Iniciando sesión</Typography>

      {isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={24} />

          <Typography className="form-subtitle">
            Autenticando con Google, por favor espera...
          </Typography>
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {queryError?.message || "Algo salió mal"}
        </Alert>
      )}
    </Box>
  );
};

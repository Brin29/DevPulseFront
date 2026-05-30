import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTeamInvitationMutations } from "../../hooks/invitationTeam.hook";

export const AcceptInvitationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { acceptInvitation, cancelInvitation } = useTeamInvitationMutations();

  useEffect(() => {
    const authMeStr = localStorage.getItem("authMe");

    if (!authMeStr) {
      const redirect = encodeURIComponent(location.pathname);
      localStorage.setItem("auth_redirect", redirect);
      navigate(`/sign-in?redirect=${redirect}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleAccept = () => {
    if (!token) return;
    acceptInvitation.mutate(token);
  };

  const handleCancel = () => {
    if (!token) return;
    cancelInvitation.mutate(token);
    navigate("/dashboard");
  };

  return (
    <div className="page">
      <main className="main">
        {acceptInvitation.isSuccess ? (
          <Box className="form-container" sx={{ textAlign: "center" }}>
            <CheckCircleIcon
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography component="h2">¡Invitación aceptada!</Typography>
            <Typography>
              Te has unido al equipo exitosamente.
            </Typography>
            <Button onClick={() => navigate("/dashboard")}>
              Ir al Dashboard
            </Button>
          </Box>
        ) : acceptInvitation.isError ? (
          <Box className="form-container" sx={{ textAlign: "center" }}>
            <Typography component="h2">Error</Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              {(acceptInvitation.error as any)?.message ||
                "No se pudo aceptar la invitación. Intenta de nuevo."}
            </Alert>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
            >
              Volver al Dashboard
            </Button>
          </Box>
        ) : (
          <Box className="form-container" sx={{ textAlign: "center" }}>
            <Typography component="h2">Invitación a equipo</Typography>
            <Typography>
              Has recibido una invitación para unirte a un equipo. ¿Deseas
              aceptarla?
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={handleAccept}
                disabled={acceptInvitation.isPending}
                sx={{ minWidth: 140 }}
              >
                {acceptInvitation.isPending ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Aceptar"
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={acceptInvitation.isPending}
                sx={{ minWidth: 140 }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        )}
      </main>
    </div>
  );
};

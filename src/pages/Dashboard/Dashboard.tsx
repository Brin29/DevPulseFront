import { Box, Card, CardContent, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <GroupsIcon sx={{ fontSize: 28 }} />,
    title: "Equipos",
    description: "Crea y gestiona equipos de trabajo. Organiza miembros por roles y colabora en tiempo real.",
    path: "/teams",
    color: "#4c0e7e",
  },
  {
    icon: <TaskAltIcon sx={{ fontSize: 28 }} />,
    title: "Tareas",
    description: "Administra tareas con tableros Kanban, asigna responsables y da seguimiento al progreso.",
    path: "/teams",
    color: "#6a2b9e",
  },
  {
    icon: <BuildCircleIcon sx={{ fontSize: 28 }} />,
    title: "En desarrollo",
    description: "Próximamente: reportes, calendarios, notificaciones y más herramientas de productividad.",
    path: "",
    color: "#d97706",
    disabled: true,
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <RocketLaunchIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            DevPulse
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          Sistema de organización de tareas y gestión de equipos. Actualmente en
          desarrollo activo — nuevas funcionalidades se agregarán constantemente.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: 3,
          mb: 4,
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            variant="outlined"
            onClick={() => !feature.disabled && navigate(feature.path)}
            sx={{
              borderRadius: 2,
              cursor: feature.disabled ? "default" : "pointer",
              transition: "box-shadow 0.2s, transform 0.2s",
              "&:hover": feature.disabled
                ? {}
                : { boxShadow: 4, transform: "translateY(-2px)" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  bgcolor: `${feature.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "primary.main" + "08" }}>
        <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <BuildCircleIcon sx={{ fontSize: 36, color: "primary.main" }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Estado del desarrollo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DevPulse está en fase activa de desarrollo. Puedes explorar las secciones de Equipos y Tareas
              para probar las funcionalidades actuales. Seguimos trabajando en nuevas herramientas para
              mejorar tu productividad.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

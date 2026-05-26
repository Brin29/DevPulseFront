import { Typography, Box } from "@mui/material";

export const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Bienvenido a DevPulse. Selecciona una opción del menú lateral para
        comenzar.
      </Typography>
    </Box>
  );
};

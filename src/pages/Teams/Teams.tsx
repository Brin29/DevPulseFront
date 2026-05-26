import { Typography, Alert, Box, CircularProgress } from "@mui/material";
import { useTeams } from "../../hooks/team.hook";
import { TeamCard } from "../../components/Team/TeamCard";
import { CreateTeamDialog } from "../../components/Team/CreateTeamDialog";

export const Teams = () => {
  const { data, isLoading, isError, error: queryError } = useTeams();

  return (
    <Box className="teams-page">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Equipos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Gestiona tus equipos de trabajo
          </Typography>
        </Box>
        <CreateTeamDialog />
      </Box>

      {isLoading && (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error: {queryError?.message || "Algo salió mal"}
        </Alert>
      )}

      {data && data.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {data.map((team: any) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </Box>
      )}

      {data && data.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
            No hay equipos todavía
          </Typography>
          <Typography variant="body2">
            Crea tu primer equipo para empezar a colaborar
          </Typography>
        </Box>
      )}
    </Box>
  );
};

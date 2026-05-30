import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useTeam } from "../../hooks/team.hook";
import { useTeamContext } from "../../context/TeamContext";
import { KanbanBoard } from "../../components/Task/KanbanBoard";

export const Tasks = () => {
  const { id } = useParams<{ id: string }>();
  const { data: teamData } = useTeam(id!);
  const { setSelectedTeam } = useTeamContext();

  useEffect(() => {
    if (teamData?.team) {
      setSelectedTeam({ id: teamData.team.id, name: teamData.team.name });
    }
    return () => setSelectedTeam(null);
  }, [teamData, setSelectedTeam]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Tareas
        </Typography>
      </Box>
      <KanbanBoard />
    </Box>
  );
};

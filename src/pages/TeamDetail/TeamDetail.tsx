import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Groups";
import { useTeam } from "../../hooks/team.hook";
import { DeleteTeamDialog } from "../../components/Team/DeleteTeamDialog";
import { EditTeamDialog } from "../../components/Team/EditTeamDialog";
import { SendInvitationTeam } from "../../components/InvitationsTeam/SendInvitationTeam";
import { InvitationsList } from "../../components/InvitationsTeam/InvitationsList";
import { useTeamContext } from "../../context/TeamContext";

export const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error: queryError } = useTeam(id!);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const { setSelectedTeam } = useTeamContext();

  const userMeSTR = JSON.parse(localStorage.getItem("meUser")!!);
  const myUserId = userMeSTR.id;

  useEffect(() => {
    if (data?.team) {
      setSelectedTeam({ id: data.team.id, name: data.team.name });
    }
    return () => setSelectedTeam(null);
  }, [data, setSelectedTeam]);

  useEffect(() => {
    data?.team?.members.map((el: any) => {
      if (el.role.toLowerCase() === "admin") {
        const userId = el.userId._id;
        if (userId === myUserId) {
          setIsUserAdmin(true);
        }
      } else {
        return;
      }
    });
  }, [data]);

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/teams")}
        sx={{ mb: 3, color: "text.secondary" }}
      >
        Volver a equipos
      </Button>

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

      {data && (
        <>
          <Card variant="outlined" sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "14px",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GroupIcon sx={{ color: "white", fontSize: 32 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {data.team.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.team.members?.length || 0} miembro
                    {data.team.members?.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <EditTeamDialog team={data.team} />
                  <DeleteTeamDialog />
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {data.team.description}
              </Typography>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Miembros
            </Typography>
            {isUserAdmin && <SendInvitationTeam />}
          </Box>

          {data.team.members && data.team.members.length > 0 ? (
            <Stack spacing={1.5}>
              {data.team.members.map((member: any) => {
                const { userId: user } = member;
                return (
                  <Card
                    key={user._id}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                        "&:last-child": { pb: 1.5 },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
                          {user.firstName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={member.role}
                        size="small"
                        color={member.role === "ADMIN" ? "primary" : "default"}
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          ) : (
            <Typography color="text.secondary">
              No hay miembros en este equipo
            </Typography>
          )}

          {isUserAdmin && <InvitationsList teamId={id!} />}
        </>
      )}
    </Box>
  );
};

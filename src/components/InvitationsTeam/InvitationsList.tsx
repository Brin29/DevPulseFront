import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import { useInvitationsTeam, useTeamInvitationMutations } from "../../hooks/invitationTeam.hook";
import type { Invitation } from "../../models/invitationTeams.models";
import { useState } from "react";
import { Modal } from "../Modals/Modal";

interface InvitationsListProps {
  teamId: string;
}

export const InvitationsList = ({ teamId }: InvitationsListProps) => {
  const { data, isLoading, isError, error: queryError } = useInvitationsTeam(teamId);
  const { deleteInvitation } = useTeamInvitationMutations();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const invitations: Invitation[] = Array.isArray(data) ? data : data?.invitations ?? [];

  const handleDelete = () => {
    if (deleteTarget) {
      deleteInvitation.mutate(deleteTarget, {
        onSuccess: () => setDeleteTarget(null),
      });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Invitaciones Enviadas
      </Typography>

      {isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {queryError?.message || "Algo salió mal"}
        </Alert>
      )}

      {!isLoading && !isError && invitations.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          No hay invitaciones pendientes
        </Typography>
      )}

      {invitations.length > 0 && (
        <Stack spacing={1}>
          {invitations.map((inv) => (
            <Card key={inv.id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.5,
                  "&:last-child": { pb: 1.5 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <EmailIcon sx={{ color: "grey.400", fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {inv.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleDateString()
                        : ""}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={inv.role}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  />
                  {inv.status && (
                    <Chip
                      label={inv.status === "pending" ? "Pendiente" : inv.status}
                      size="small"
                      color={inv.status === "pending" ? "warning" : "success"}
                    />
                  )}
                  <Tooltip title="Eliminar invitación">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(inv.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar invitación"
        sendInfo
        nameBtn="Eliminar"
        onClick={handleDelete}
      >
        <Typography>
          ¿Estás seguro de que deseas eliminar esta invitación?
        </Typography>
      </Modal>
    </Box>
  );
};

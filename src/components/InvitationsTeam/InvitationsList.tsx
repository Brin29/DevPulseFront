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
  Pagination,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import {
  useInvitationsTeam,
  useTeamInvitationMutations,
} from "../../hooks/invitationTeam.hook";
import type { Invitation } from "../../models/invitationTeams.models";
import { useState } from "react";
import { Modal } from "../Modals/Modal";

interface InvitationsListProps {
  teamId: string;
}

export const InvitationsList = ({ teamId }: InvitationsListProps) => {
  const [open, setOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
    
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useInvitationsTeam(
    {
      page,
      limit: pageSize,
    },
    teamId,
  );
  const { deleteInvitation } = useTeamInvitationMutations();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const invitations: Invitation[] = Array.isArray(data)
    ? data
    : (data?.invitations ?? []);

  const totalCount = data?.total;

  const openDeleteModal = (id: string) => {
    setDeleteTarget(id);
    setOpen(true);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteInvitation.mutate(deleteTarget, {
        onSuccess: () => {
          setOpen(false);
          setSuccessModal(true);
        },
        onError: () => {
          setOpen(false);
          setErrorModal(true);
        },
      });
    }
    //   // if (deleteTarget) {
    //     // deleteInvitation.mutate(deleteTarget, {
    //       // onSuccess: () => setDeleteTarget(null),
    //     });
    //   }
  };

  const onPageSizeChange = (s: number) => {
    setPageSize(s);
    setPage(1);
  };

  const onPageChange = (s: number) => {
    setPage(s)
  }

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
            <Card key={inv._id} variant="outlined" sx={{ borderRadius: 2 }}>
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
                      label={
                        inv.status === "pending" ? "Pendiente" : inv.status
                      }
                      size="small"
                      color={inv.status === "pending" ? "warning" : "success"}
                    />
                  )}
                  <Tooltip title="Eliminar invitación">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openDeleteModal(String(inv._id))}
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

      {data && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 4,
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Pagination
            color="primary"
            count={Math.ceil(totalCount / pageSize)}
            page={page}
            onChange={(_, v) => onPageChange(v)}
          />
          <TablePagination
            component="div"
            count={totalCount}
            page={page - 1}
            onPageChange={() => {}}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 15]}
            labelRowsPerPage=""
            ActionsComponent={() => null}
            labelDisplayedRows={() => ""}
            sx={{ border: "none" }}
          />
        </Box>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Eliminar invitación"
        sendInfo
        nameBtn="Eliminar"
        onClick={handleDelete}
      >
        <Typography>
          ¿Estás seguro de que deseas eliminar esta invitación?
        </Typography>
      </Modal>

      {successModal && (
        <Modal
          title="Creación Exitosa"
          open={successModal}
          onClose={() => setSuccessModal(false)}
        >
          <Typography>La eliminación fue exitosa</Typography>
        </Modal>
      )}

      {errorModal && (
        <Modal
          title="Ocurrio un error"
          open={errorModal}
          onClose={() => setErrorModal(false)}
        >
          <Typography>Ocurrio un error en la eliminación</Typography>
        </Modal>
      )}
    </Box>
  );
};

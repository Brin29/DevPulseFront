import { Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useTeamMutations } from "../../hooks/team.hook";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../Modals/Modal";

export const DeleteTeamDialog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const { delete: deleteTeam } = useTeamMutations();

  const handleDelete = () => {
    deleteTeam.mutate(id!, {
      onSuccess: () => navigate("/teams"),
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => setDeleteModal(true)}
      >
        Eliminar
      </Button>

      <Modal
        nameBtn="Eliminar"
        title="Eliminar"
        sendInfo={true}
        onClick={handleDelete}
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
      >
        <Typography>
          ¿Estás seguro de que deseas eliminar? Esta acción no se puede
          deshacer.
        </Typography>
      </Modal>
    </>
  );
};

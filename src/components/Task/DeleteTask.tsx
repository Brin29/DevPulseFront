import DeleteIcon from "@mui/icons-material/Delete";
import { Modal } from "../Modals/Modal";
import { IconButton, Typography } from "@mui/material";

export interface DeleteTaskProps {
  onDelete: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  errorModal: boolean;
  setErrorModal: (value: boolean) => void;
}

export const DeleteTask: React.FC<DeleteTaskProps> = ({ open, setOpen, onDelete, errorModal, setErrorModal }) => {

  return (
    <>
      <IconButton onClick={() => setOpen(true)} size="small" color="error">
        <DeleteIcon />
      </IconButton>

      <Modal
        title="Eliminar tarea"
        onClick={onDelete}
        nameBtn="Eliminar"
        onClose={() => setOpen(false)}
        sendInfo={true}
        open={open}
      >
        <Typography>
          ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se
          puede deshacer.
        </Typography>
      </Modal>

      {errorModal && (
        <Modal
          title="Ocurrio un error"
          open={errorModal}
          onClose={() => setErrorModal(false)}
        >
          <Typography>Ocurrio un error en la eliminación</Typography>
        </Modal>
      )}
    </>
  );
};

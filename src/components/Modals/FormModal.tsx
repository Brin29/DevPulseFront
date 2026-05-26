import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type React from "react";

export interface FormModalProps {
  open: boolean;
  children: React.ReactElement;
  onClose: () => void;
  onSubmit: () => void;
  submitBtn?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  open,
  children,
  onClose,
  onSubmit,
  submitBtn = "Enviar"
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Crear Equipo</DialogTitle>
      <Box component="form" onSubmit={onSubmit}>
        <DialogContent>{children}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {submitBtn}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

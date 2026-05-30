import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  type Breakpoint,
} from "@mui/material";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  sendInfo?: boolean;
  nameBtn?: string;
  onClick?: () => void;
  title: string;
  children: React.ReactElement;
  maxWidth?: Breakpoint;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  sendInfo = false,
  onClick,
  nameBtn = "Enviar", 
  title,
  children,
  maxWidth = "sm"
}) => {
  return (
    <Dialog maxWidth={maxWidth} open={open} onClose={onClose}  fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <Box>
        <DialogContent>{children}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {sendInfo ? (
            <>
              <Button onClick={onClose} color="inherit">
                Cancelar
              </Button>

              <Button onClick={onClick} color="inherit">
                {nameBtn}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} color="inherit">
              Aceptar
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

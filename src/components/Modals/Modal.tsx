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
  maxWidth = "sm",
}) => {
  return (
    <Dialog maxWidth={maxWidth} open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {title}
      </DialogTitle>
      <Box
        sx={{ flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <DialogContent>{children}</DialogContent>
        <DialogActions sx={{ mb: 2, px: 3, pb: 2 }}>
          {sendInfo ? (
            <>
              <Button variant="contained" onClick={onClose}>
                Cancelar
              </Button>

              <Button variant="outlined" onClick={onClick}>
                {nameBtn}
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={onClose}>
              Aceptar
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

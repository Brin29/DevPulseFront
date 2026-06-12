import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  PhotoCamera,
  Close,
  EmailOutlined,
  ShieldOutlined,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { getUserProfile, authUserMutations } from "../../hooks/auth.hook";
import { useForm } from "react-hook-form";
import { Input, InputType } from "../Input";
import { profileUserMutations } from "../../hooks/profile.hook";
import { Modal } from "./Modal";
import type { ApiResponseError } from "../../models/api.model";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { data: user, isLoading, isError, error } = getUserProfile();
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { avatarUpload, passwordChange, accountDelete } = authUserMutations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { updateProfile } = profileUserMutations();

  const { control, reset, getValues } = useForm<any>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        email: user.user.email,
      });
    }
  }, [user]);

  const handleFieldBlur = (field: "firstName" | "lastName") => () => {
    const value = getValues(field)?.trim();
    if (value && value !== user?.user?.[field]) {
      updateProfile.mutate({ [field]: value });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    avatarUpload.mutate(formData, {
      onSuccess: (data) => {
        localStorage.setItem("meUser", JSON.stringify(data.user));
        setUploading(false)
        setSuccessModal(true);
      },
      onError: (error: ApiResponseError) => {
        setErrorModal(true);
        setUploading(false)
        setErrorMessage(error?.response?.data?.error);
      },
    });
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Perfil</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            py: 4,
          }}
        >
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rounded" width="100%" height={200} />
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Perfil</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            py: 4,
          }}
        >
          <Typography color="error">
            {(error as any)?.message || "Error al cargar el perfil"}
          </Typography>
          <Button variant="contained" onClick={onClose}>
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Perfil
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          py: 4,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={user?.user?.avatar || undefined}
            sx={{
              width: 120,
              height: 120,
              fontSize: 48,
              border: "3px solid",
              borderColor: "primary.main",
            }}
          />
          <IconButton
            onClick={handleAvatarClick}
            size="small"
            sx={{
              position: "absolute",
              bottom: 0,
              right: -4,
              bgcolor: "primary.main",
              color: "#fff",
              width: 36,
              height: 36,
              "&:hover": { bgcolor: "primary.dark" },
              zIndex: 1,
            }}
          >
            <PhotoCamera fontSize="small" />
          </IconButton>

          {uploading && (
            <CircularProgress
              size={120}
              thickness={2}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "primary.main",
              }}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Box>

        <Divider sx={{ width: "100%" }} />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Primer nombre
                </Typography>
                {
                  <Input
                    sx={{ fontWeight: 500 }}
                    control={control}
                    type={InputType.TEXT}
                    name="firstName"
                    disabled={false}
                    onBlur={handleFieldBlur("firstName")}
                  />
                }
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Segundo nombre
              </Typography>
              <Input
                sx={{ fontWeight: 500 }}
                control={control}
                type={InputType.TEXT}
                name="lastName"
                disabled={false}
                onBlur={handleFieldBlur("lastName")}
              />
            </Box>

            <Divider sx={{ width: "100%" }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <EmailOutlined color="action" />
              <Box sx={{ width: "100%" }}>
                <Typography variant="caption" color="text.secondary">
                  Correo electrónico
                </Typography>
                <Input
                  sx={{ fontWeight: 500 }}
                  control={control}
                  type={InputType.TEXT}
                  label=""
                  name="email"
                  disabled={true}
                />
              </Box>
            </Box>

            <Divider sx={{ width: "100%" }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ShieldOutlined color="action" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Rol
                </Typography>
                <Box>
                  <Chip
                    label={user?.role || "Usuario"}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-evenly" }}>
        <Button
          variant="outlined"
          onClick={() => passwordChange.mutate}
          disabled={true}
        >
          Cambiar Contraseña
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => accountDelete.mutate}
          disabled={true}
        >
          {accountDelete.isPending ? "Eliminando..." : "Eliminar Cuenta"}
        </Button>
      </DialogActions>

      {successModal && (
        <Modal
          title="Creación Exitosa"
          open={successModal}
          onClose={() => setSuccessModal(false)}
        >
          <Typography>Imagen cambiada de forma correcta</Typography>
        </Modal>
      )}

      {errorModal && (
        <Modal
          title="Ocurrio un error"
          open={errorModal}
          onClose={() => setErrorModal(false)}
        >
          <Typography>{errorMessage}</Typography>
        </Modal>
      )}
    </Dialog>
  );
};

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import type { SendInvitationModel } from "../../models/invitationTeams.models";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTeamInvitationMutations } from "../../hooks/invitationTeam.hook";
import { FormModal } from "../Modals/FormModal";
import { Input, InputType } from "../Input";
import { useParams } from "react-router-dom";

export const SendInvitationTeam = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);

  const { sendInvitation } = useTeamInvitationMutations();

  const { control, handleSubmit, reset } = useForm<SendInvitationModel>({
    defaultValues: { email: "", role: "Developer" },
  });

  const handleOpenInvite = () => {
    setOpen(true);
  };

  const onSubmit = (data: SendInvitationModel) => {
    sendInvitation.mutate(
      { id: id!, payload: data },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        startIcon={<PersonAddIcon />}
        onClick={handleOpenInvite}
      >
        Agregar Miembro
      </Button>

      <FormModal
        title="Enviar invitacion"
        submitBtn="Enviar"
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2.5}>
          <Input
            control={control}
            type={InputType.TEXT}
            label="Email"
            name="email"
            disabled={false}
          />

          <Controller
            name="role"
            control={control}
            rules={{ required: "El rol es requerido" }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>Rol</InputLabel>
                <Select {...field} label="Rol">
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Viewer">Viewer</MenuItem>
                </Select>
                {fieldState.error && (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Stack>
      </FormModal>
    </>
  );
};

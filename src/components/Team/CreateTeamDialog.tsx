import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import type { CreateTeamRequest } from "../../models/team.model";
import { useTeamMutations } from "../../hooks/team.hook";
import { Input, InputType } from "../Input";
import { FormModal } from "../Modals/FormModal";
import { Modal } from "../Modals/Modal";

export const CreateTeamDialog = () => {
  const [open, setOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { create } = useTeamMutations();

  const { control, handleSubmit, reset } = useForm<CreateTeamRequest>({
    defaultValues: { name: "", description: "", slug: "", logo: "" },
  });

  const onSubmit = (data: CreateTeamRequest) => {
    create.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        setSuccessModal(true);
        reset();
      },
      onError: () => {
        setOpen(false);
        setErrorModal(true);
        reset();
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Crear Equipo
      </Button>

      <FormModal
        submitBtn="Crear"
        onSubmit={handleSubmit(onSubmit)}
        open={open}
        onClose={handleClose}
      >
        <Stack spacing={2.5}>
          <Input
            control={control}
            type={InputType.TEXT}
            label="Nombre del equipo"
            name="name"
            disabled={false}
          />

          <Input
            control={control}
            type={InputType.TEXT}
            label="Descripción"
            name="description"
            disabled={false}
          />

          <Input
            control={control}
            type={InputType.TEXT}
            label="Slug"
            name="slug"
            disabled={false}
          />
        </Stack>
      </FormModal>

      {successModal && (
        <Modal
          title="Creación Exitosa"
          open={successModal}
          onClose={() => setSuccessModal(false)}
        >
          <Typography>La Creación fue exitosa</Typography>
        </Modal>
      )}

      {errorModal && (
        <Modal
          title="Ocurrio un error"
          open={errorModal}
          onClose={() => setErrorModal(false)}
        >
          <Typography>Ocurrio un error en la creación</Typography>
        </Modal>
      )}
    </>
  );
};

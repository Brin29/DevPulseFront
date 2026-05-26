import { Button, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { FormModal } from "../Modals/FormModal";
import { useEffect, useState } from "react";
import { useTeamMutations } from "../../hooks/team.hook";
import { Input, InputType } from "../Input";
import { useForm } from "react-hook-form";
import type { UpdateTeamRequest } from "../../models/team.model";
import { useParams } from "react-router-dom";
import { Modal } from "../Modals/Modal";

export interface EditTeamDialogProps {
  team: any;
}

export const EditTeamDialog: React.FC<EditTeamDialogProps> = ({ team }) => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { edit } = useTeamMutations();

  const { name, description, slug } = team;

  const { control, handleSubmit, reset } = useForm<UpdateTeamRequest>({
    defaultValues: { name: "", description: "", slug: "" },
  });

  useEffect(() => {
    reset({
      name,
      description,
      slug,
    });
  }, [team]);

  const onSubmit = (data: UpdateTeamRequest) => {
    if (id) {
      edit.mutate(
        { id, payload: data },
        {
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
        },
      );
    } else {
      console.log("Ocurrio un error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<EditIcon />}
        onClick={() => setOpen(true)}
      >
        Editar
      </Button>

      <FormModal
        submitBtn="Editar"
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
          <Typography>La edición fue exitosa</Typography>
        </Modal>
      )}

      {errorModal && (
        <Modal
          title="Ocurrio un error"
          open={errorModal}
          onClose={() => setErrorModal(false)}
        >
          <Typography>Ocurrio un error en la edición</Typography>
        </Modal>
      )}
    </>
  );
};

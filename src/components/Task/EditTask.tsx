import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { FormModal } from "../Modals/FormModal";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { UpdateTaskRequest } from "../../models/task.model";
import { useTaskFormParams, useTaskMutations } from "../../hooks/task.hook";
import { useParams } from "react-router-dom";
import { Input, InputType } from "../Input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Modal } from "../Modals/Modal";
import type { ApiResponseError } from "../../models/api.model";

export interface EditTaskProps {
  taskData: any;
}

export const EditTask: React.FC<EditTaskProps> = ({ taskData }) => {
  const { id: teamId } = useParams<{ id: string }>();
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { edit: editTask } = useTaskMutations();
  const { data: paramForm } = useTaskFormParams(teamId!!);

  const { _id: taskId } = taskData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskRequest>({
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      assigneeId: "",
      dueDate: "",
      type: "",
    },
  });

  useEffect(() => {
    reset({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      assigneeId: taskData.assigneeId._id,
      dueDate: taskData.dueDate ?? dayjs(taskData.dueDate),
      type: taskData.type,
    });
  }, [taskData]);

  const onSubmit = (formData: UpdateTaskRequest) => {
    editTask.mutate(
      { teamId: teamId!!, taskId: taskId!!, payload: formData },
      {
        onSuccess: () => {
          setOpen(false);
          setSuccessModal(true);
        },
        onError: (error: ApiResponseError) => {
          setErrorModal(true);
          setErrorMessage(error?.response?.data?.error);
        },
      },
    );
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} size="small" color="primary">
        <EditIcon />
      </IconButton>

      <FormModal
        title="Editar equipo"
        open={open}
        onSubmit={handleSubmit(onSubmit)}
        submitBtn="Editar"
        onClose={() => setOpen(false)}
      >
        <Stack spacing={2.5}>
          <Input
            control={control}
            type={InputType.TEXT}
            label="Titulo de la tarea"
            name="title"
            disabled={false}
          />

          <Input
            control={control}
            type={InputType.TEXT}
            label="Descripción de la tarea"
            name="description"
            disabled={false}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Fecha de vencimiento"
                  value={field.value ? dayjs(field.value) : null}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              )}
            />
          </LocalizationProvider>

          <Controller
            name="type"
            control={control}
            rules={{ required: "El tipo es requerido" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Tipo</InputLabel>
                <Select {...field} label="Tipo">
                  <MenuItem value="BUG">Bug</MenuItem>
                  <MenuItem value="FEAUTERE">Feauture</MenuItem>
                  <MenuItem value="TASK">Tarea</MenuItem>
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="priority"
            control={control}
            rules={{ required: "El tipo es requerido" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Prioridad</InputLabel>
                <Select {...field} label="Tipo">
                  <MenuItem value="LOW">Baja</MenuItem>
                  <MenuItem value="MEDIUM">Mediana</MenuItem>
                  <MenuItem value="HIGH">Alta</MenuItem>
                  <MenuItem value="CRITICAL">Critica</MenuItem>
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="assigneeId"
            control={control}
            rules={{ required: "El tipo es requerido" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Asignar</InputLabel>
                <Select {...field} label="Tipo">
                  {paramForm?.members?.map((m: any) => (
                    <MenuItem value={m.userId._id}>
                      {m.userId.firstName} {m.userId.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Stack>
      </FormModal>

      {successModal && (
        <Modal
          title="Edición Exitosa"
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
          <Typography>{errorMessage}</Typography>
        </Modal>
      )}
    </>
  );
};

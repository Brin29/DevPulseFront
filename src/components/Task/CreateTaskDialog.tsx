import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useTaskFormParams, useTaskMutations } from "../../hooks/task.hook";
import { FormModal } from "../Modals/FormModal";
import { Controller, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import type { CreateTaskRequest } from "../../models/task.model";
import { Input, InputType } from "../Input";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const CreateTaskDialog = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const { create } = useTaskMutations();
  const { data: paramForm } = useTaskFormParams(id!!);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskRequest>({
    defaultValues: {
      title: "",
      description: "",
      priority: "LOW",
      assigneeId: "",
      type: "BUG",
      dueDate: "",
    },
  });

  const onSubmit = (data: CreateTaskRequest) => {
    create.mutate(
      { teamId: id!!, payload: data },
      {
        onSuccess: () => {
          
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
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ mx: 1.5, mb: 1.5 }}
      >
        Crear Tarea
      </Button>

      <FormModal
        title="Crear equipo"
        open={open}
        onClose={handleClose}
        submitBtn="Crear"
        onSubmit={handleSubmit(onSubmit)}
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
    </>
  );
};

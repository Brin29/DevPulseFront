import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
  Box,
} from "@mui/material";
import type { CreateTaskRequest } from "../models/task.model";
import { useCreateTask } from "../hooks/task.hook";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateTaskDialog = ({ open, onClose }: CreateTaskDialogProps) => {
  const createTaskMutation = useCreateTask();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskRequest>({
    defaultValues: {
      title: "",
      description: "",
      type: "task",
      priority: "MEDIUM",
      assignee: "",
    },
  });

  const onSubmit = (data: CreateTaskRequest) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Crear Tarea</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            {createTaskMutation.isError && (
              <Alert severity="error">
                {createTaskMutation.error instanceof Error
                  ? createTaskMutation.error.message
                  : "Error al crear la tarea"}
              </Alert>
            )}

            <Controller
              name="title"
              control={control}
              rules={{ required: "El título es requerido" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              rules={{ required: "El tipo es requerido" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Tipo</InputLabel>
                  <Select {...field} label="Tipo">
                    <MenuItem value="bug">Bug</MenuItem>
                    <MenuItem value="incident">Incidente</MenuItem>
                    <MenuItem value="improvement">Mejora</MenuItem>
                    <MenuItem value="task">Tarea</MenuItem>
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
              rules={{ required: "La prioridad es requerida" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.priority}>
                  <InputLabel>Prioridad</InputLabel>
                  <Select {...field} label="Prioridad">
                    <MenuItem value="LOW">Baja</MenuItem>
                    <MenuItem value="MEDIUM">Media</MenuItem>
                    <MenuItem value="HIGH">Alta</MenuItem>
                    <MenuItem value="CRITICAL">Crítica</MenuItem>
                  </Select>
                  {errors.priority && (
                    <FormHelperText>{errors.priority.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="assignee"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Asignado a" fullWidth />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? "Creando..." : "Crear"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

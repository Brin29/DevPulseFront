import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type {
  TaskType,
  TaskPriority,
} from "../../models/task.model";
import {
  useTask,
  useTaskMutations,
} from "../../hooks/task.hook";
import { useParams } from "react-router-dom";
import { useState } from "react";

import {
  toLocaleDate,
  toLocaleDateaMinutes,
} from "../../utilities/toLocaleDate";
import { DeleteTask } from "./DeleteTask";
import { EditTask } from "./EditTask";

const typeColors: Record<TaskType, string> = {
  BUG: "#e53935",
  FEAUTERE: "#1e88e5",
  TASK: "#43a047",
};

const typeLabels: Record<TaskType, string> = {
  BUG: "Bug",
  FEAUTERE: "Mejora",
  TASK: "Tarea",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "#5e6c84",
  MEDIUM: "#0052cc",
  HIGH: "#ff8b00",
  CRITICAL: "#e53935",
};

const statusLabels: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

interface TaskDetailDialogProps {
  // task: Task | null;
  taskId: string | undefined;
  open: boolean;
  onClose: () => void;
  onTaskDelete?: () => void;
}

export const TaskDetailDialog = ({
  taskId,
  open,
  onClose,
  onTaskDelete,
}: TaskDetailDialogProps) => {
  const { id: teamId } = useParams<{ id: string }>();
  const { delete: deleteTask } = useTaskMutations();
  const [errorModal, setErrorModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: dataTask,
    isLoading,
    isError,
    error: queryError,
  } = useTask(taskId!!, teamId!!);

  const handleDelete = () => {
    deleteTask.mutate(
      { teamId: teamId!!, taskId: dataTask.task._id },
      {
        onSuccess: () => {
          setDeleteOpen(false);
          onClose();
          onTaskDelete?.();
        },
        onError: () => {
          setErrorModal(true);
          setDeleteOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <>
        {isLoading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {queryError?.message || "Algo salió mal"}
          </Alert>
        )}

        {dataTask && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: 600,
              }}
            >
              {dataTask.task.title}
              <Box sx={{ display: "flex", gap: 0.5 }}>
                  <>
                  <EditTask taskData={dataTask.task}/>
                    <DeleteTask
                      open={deleteOpen}
                      setOpen={setDeleteOpen}
                      setErrorModal={setErrorModal}
                      errorModal={errorModal}
                      onDelete={handleDelete}
                    />
                  </>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                {/* Columna izquierda: Descripción y Comentarios */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        Descripción
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {dataTask.task.description || "Sin descripción"}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 2 }}
                      >
                        Comentarios
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Escribe un comentario..."
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Columna derecha: Detalles */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Detalles
                    </Typography>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                      >
                        Fecha de vencimiento
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {toLocaleDate(dataTask.task.dueDate)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                        >
                          Tipo
                        </Typography>
                        <Chip
                          label={typeLabels[dataTask.task.type as TaskType]}
                          size="small"
                          sx={{
                            bgcolor: typeColors[dataTask.task.type as TaskType],
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                        >
                          Prioridad
                        </Typography>
                        <Chip
                          label={dataTask.task.priority}
                          size="small"
                          sx={{
                            bgcolor:
                              priorityColors[
                                dataTask.task.priority as TaskPriority
                              ],
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                        >
                          Estado
                        </Typography>
                        <Chip
                          label={statusLabels[dataTask.task.status]}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                      >
                        Asignado a
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {dataTask.task.assigneeId.firstName +
                          " " +
                          dataTask.task.assigneeId.lastName || "Sin asignar"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                      >
                        Reportado por
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {dataTask.task.reporterId.firstName +
                          " " +
                          dataTask.task.reporterId.lastName || "Sin asignar"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                      >
                        Creado el
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {toLocaleDateaMinutes(dataTask.task.createdAt)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                      >
                        Actualizado el
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {toLocaleDateaMinutes(dataTask.task.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {/* )} */}
            </DialogContent>
          </>
        )}
      </>
    </Dialog>
  );
};

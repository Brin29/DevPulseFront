import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTasks } from "../../hooks/task.hook";
import { KanbanBoard } from "../../components/KanbanBoard";
import { CreateTaskDialog } from "../../components/CreateTaskDialog";

export const Tasks = () => {
  const [open, setOpen] = useState(false);
  const { data: tasks, isLoading } = useTasks();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Tareas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Crear Tarea
        </Button>
      </Box>

      {isLoading ? (
        <Typography color="text.secondary">Cargando tareas...</Typography>
      ) : tasks && tasks.length > 0 ? (
        <KanbanBoard tasks={tasks} />
      ) : (
        <Typography color="text.secondary">
          No hay tareas todavía. Crea tu primera tarea.
        </Typography>
      )}

      <CreateTaskDialog open={open} onClose={() => setOpen(false)} />
      <KanbanBoard tasks={[]}/>
    </Box>
  );
};

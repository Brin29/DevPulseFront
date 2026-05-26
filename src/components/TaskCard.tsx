import { Box, Chip, Typography } from "@mui/material";
import type { Task, TaskType, TaskPriority } from "../models/task.model";

const typeColors: Record<TaskType, string> = {
  bug: "#e53935",
  incident: "#fb8c00",
  improvement: "#1e88e5",
  task: "#43a047",
};

const typeLabels: Record<TaskType, string> = {
  bug: "Bug",
  incident: "Incidente",
  improvement: "Mejora",
  task: "Tarea",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "#5e6c84",
  MEDIUM: "#0052cc",
  HIGH: "#ff8b00",
  CRITICAL: "#e53935",
};

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export const TaskCard = ({ task, isDragging, onDragStart, onDragEnd }: TaskCardProps) => {
  return (
    <Box
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      sx={{
        bgcolor: "#fff",
        borderRadius: 1,
        p: 1.5,
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.15s, opacity 0.15s",
        "&:hover": {
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        },
        "&:active": { cursor: "grabbing" },
        userSelect: "none",
        border: "1px solid #dfe1e6",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: "0.8125rem",
          color: "#172b4d",
          mb: 1.5,
          lineHeight: 1.4,
        }}
      >
        {task.title}
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", alignItems: "center" }}>
        <Chip
          label={typeLabels[task.type]}
          size="small"
          sx={{
            bgcolor: typeColors[task.type],
            color: "#fff",
            fontSize: "0.65rem",
            height: 20,
            fontWeight: 600,
          }}
        />
        <Chip
          label={task.priority}
          size="small"
          sx={{
            bgcolor: priorityColors[task.priority],
            color: "#fff",
            fontSize: "0.65rem",
            height: 20,
            fontWeight: 600,
          }}
        />
      </Box>
    </Box>
  );
};

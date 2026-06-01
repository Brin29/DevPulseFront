import { Box, Chip, Divider, Typography } from "@mui/material";
import type { Task, TaskType, TaskPriority } from "../../models/task.model";
import { toLocaleDate } from "../../utilities/toLocaleDate";

const typeColors: Record<TaskType, string> = {
  BUG: "#e53935",
  FEAUTERE: "#fb8c00",
  TASK: "#43a047",
};

const typeLabels: Record<TaskType, string> = {
  BUG: "Bug",
  FEAUTERE: "Incidente",
  TASK: "Tarea",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "#5e6c84",
  MEDIUM: "#0052cc",
  HIGH: "#ff8b00",
  CRITICAL: "#e53935",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRITICAL: "Crítica",
};

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onClick: () => void;
}

export const TaskCard = ({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
}: TaskCardProps) => {
  return (
    <Box
      draggable
      onDragStart={() => onDragStart(task._id)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      sx={{
        bgcolor: "#fff",
        borderRadius: 1,
        p: 1.5,

        opacity: isDragging ? 0.4 : 1,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.15s, opacity 0.15s",
        "&:hover": {
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
        },
        // "&:active": { cursor: "grabbing" },
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
          mb: 1,

          lineHeight: 1.4,
        }}
      >
        {task.title}
      </Typography>

      <Divider />

      <Typography
        sx={{
          fontSize: "0.8125rem",
          color: "#172b4d",
          my: 1.5,
          lineHeight: 1.4,
        }}
      >
        {task.description}
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: "0.8125rem",
          color: "#172b4d",
          lineHeight: 1.4,
        }}
      >
        {task.assigneeId.firstName + " " + task.assigneeId.lastName}
      </Typography>

      <Box sx={{ display: "flex", gap: .5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.8125rem", }}>
          Vence:
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", }} variant="subtitle2">
          {toLocaleDate(task.dueDate)}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          gap: 0.5,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
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
          label={priorityLabels[task.priority]}
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

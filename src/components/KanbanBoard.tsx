import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import type { Task, TaskStatus } from "../models/task.model";
import { TaskCard } from "./TaskCard";
import { useUpdateTaskStatus } from "../hooks/task.hook";

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "OPEN", label: "OPEN", color: "#5e6c84" },
  { status: "IN_PROGRESS", label: "IN PROGRESS", color: "#0052cc" },
  { status: "RESOLVED", label: "RESOLVED", color: "#36b37e" },
  { status: "CLOSED", label: "CLOSED", color: "#42526e" },
];

interface KanbanBoardProps {
  tasks: Task[];
}

export const KanbanBoard = ({ tasks }: KanbanBoardProps) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedOverCol, setDraggedOverCol] = useState<TaskStatus | null>(null);
  const updateStatusMutation = useUpdateTaskStatus();

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      OPEN: [],
      IN_PROGRESS: [],
      RESOLVED: [],
      CLOSED: [],
    };
    tasks.forEach((task) => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      } else {
        groups.OPEN.push(task);
      }
    });
    return groups;
  }, [tasks]);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDraggedOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverCol(status);
  };

  const handleDragLeave = (status: TaskStatus) => {
    if (draggedOverCol === status) {
      setDraggedOverCol(null);
    }
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      const task = tasks.find((t) => t.id === draggedTaskId);
      if (task && task.status !== status) {
        updateStatusMutation.mutate({ taskId: draggedTaskId, status });
      }
    }
    setDraggedTaskId(null);
    setDraggedOverCol(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        height: "calc(100vh - 200px)",
        overflow: "auto",
        px: 0.5,
      }}
    >
      {COLUMNS.map((col) => (
        <Box
          key={col.status}
          sx={{
            flex: 1,
            minWidth: 270,
            bgcolor: "#f4f5f7",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            transition: "background-color 0.15s",
            border: "2px solid transparent",
            borderColor: draggedOverCol === col.status ? col.color : "transparent",
            // bgcolor: draggedOverCol === col.status ? "#e3e7ed" : "#f4f5f7",
          }}
          onDragOver={(e) => handleDragOver(e, col.status)}
          onDragLeave={() => handleDragLeave(col.status)}
          onDrop={() => handleDrop(col.status)}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: col.color,
                mr: 1.5,
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                color: "#5e6c84",
                flex: 1,
                textTransform: "uppercase",
              }}
            >
              {col.label}
            </Typography>
            <Box
              sx={{
                bgcolor: "#dfe1e6",
                color: "#42526e",
                borderRadius: "8px",
                px: 1,
                py: 0.2,
                fontSize: "0.7rem",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              {groupedTasks[col.status].length}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              p: 1.5,
              minHeight: 100,
            }}
          >
            {groupedTasks[col.status].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isDragging={draggedTaskId === task.id}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Button,
  // CircularProgress,
  // Chip,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/TaskAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import type { ReactNode } from "react";
import { useTeamContext } from "../../context/TeamContext";
// import { useTasks } from "../../hooks/task.hook";
import { useState } from "react";
import { CreateTaskDialog } from "../CreateTaskDialog";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// const statusColors: Record<string, string> = {
//   OPEN: "#5e6c84",
//   IN_PROGRESS: "#0052cc",
//   RESOLVED: "#36b37e",
//   CLOSED: "#42526e",
// };

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Equipos", path: "/teams", icon: <GroupsIcon /> },
  { label: "Tareas", path: "/tasks", icon: <TaskIcon /> },
];

export const Sidebar = ({
  collapsed,
  mobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { selectedTeam, setSelectedTeam } = useTeamContext();
  // const { data: tasks, isLoading: tasksLoading } = useTasks(selectedTeam?.id);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  const handleBackToTeams = () => {
    setSelectedTeam(null);
    navigate("/teams");
    if (isMobile) onMobileClose();
  };

  const navContent = selectedTeam ? (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: collapsed && !isMobile ? 1 : 2, pt: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          size="small"
          onClick={handleBackToTeams}
          sx={{
            color: "grey.500",
            textTransform: "none",
            fontSize: "0.75rem",
            mb: 1,
            minWidth: 0,
            ...(collapsed && !isMobile ? { display: "none" } : {}),
          }}
        >
          Volver
        </Button>
        {(collapsed && isMobile) || !collapsed ? (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              px: 1,
              mb: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              opacity: isMobile ? 1 : collapsed ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {selectedTeam.name}
          </Typography>
        ) : null}
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setCreateTaskOpen(true)}
          sx={{
            textTransform: "none",
            fontSize: "0.75rem",
            mb: 2,
            minHeight: 32,
            ...(collapsed && !isMobile
              ? { minWidth: 0, "& .MuiButton-startIcon": { m: 0 } }
              : {}),
          }}
        >
          {(collapsed && isMobile) || !collapsed ? "Nueva Tarea" : null}
        </Button>
      </Box>

      {/* {tasksLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={20} />
        </Box>
      ) : tasks && tasks.length > 0 ? (
        <Box sx={{ flex: 1, overflow: "auto", px: collapsed && !isMobile ? 1 : 2 }}>
          {tasks.map((task: any) => (
            <Box
              key={task.id}
              sx={{
                p: 1,
                mb: 0.5,
                borderRadius: 1,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              {(collapsed && isMobile) || !collapsed ? (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      display: "block",
                      fontSize: "0.75rem",
                      lineHeight: 1.3,
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.status?.replace("_", " ")}
                    size="small"
                    sx={{
                      fontSize: "0.6rem",
                      height: 18,
                      bgcolor: statusColors[task.status] || "#5e6c84",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                </>
              ) : null}
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              opacity: isMobile ? 1 : collapsed ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          >
            No hay tareas
          </Typography>
        </Box>
      )} */}

      <CreateTaskDialog
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
      />
    </Box>
  ) : (
    <List disablePadding>
      {navItems.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            selected={isActive(item.path)}
            onClick={() => handleNavClick(item.path)}
            sx={{
              minHeight: 48,
              justifyContent: collapsed && !isMobile ? "center" : "initial",
              px: collapsed && !isMobile ? 1 : 2,
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              "&.Mui-selected": {
                backgroundColor: "primary.bg",
                "&:hover": { backgroundColor: "primary.bg" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed && !isMobile ? 0 : 40,
                justifyContent: "center",
                color: isActive(item.path) ? "primary.main" : "grey.400",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {(collapsed && isMobile) || !collapsed ? (
              <ListItemText
                primary={item.label}
                sx={{
                  opacity: isMobile ? 1 : collapsed ? 0 : 1,
                  transition: "opacity 0.2s",
                  "& .MuiListItemText-primary": {
                    fontSize: "14px",
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? "primary.main" : "grey.600",
                  },
                }}
              />
            ) : null}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 64,
            borderBottom: "1px solid",
            borderColor: "divider",
            fontFamily: '"Poppins", Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            color: "#4c0e7e",
          }}
        >
          DevPulse
        </div>
        {navContent}
      </Drawer>
    );
  }

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__header">
        <span className="sidebar__logo">
          {selectedTeam
            ? collapsed
              ? selectedTeam.name.charAt(0).toUpperCase()
              : selectedTeam.name
            : collapsed
              ? "D"
              : "DevPulse"}
        </span>
      </div>
      <nav className="sidebar__nav">{navContent}</nav>
    </aside>
  );
};

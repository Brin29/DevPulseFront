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
} from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from '@mui/icons-material/TaskAlt';
import type { ReactNode } from "react";

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

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  const navContent = (
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
        <span className="sidebar__logo">{collapsed ? "D" : "DevPulse"}</span>
      </div>
      <nav className="sidebar__nav">{navContent}</nav>
    </aside>
  );
};

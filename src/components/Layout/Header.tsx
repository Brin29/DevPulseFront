import { useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useTeamContext } from "../../context/TeamContext";
import { ProfileModal } from "../Modals/ProfileModal";

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMobileOpen: () => void;
}

export const Header = ({
  collapsed,
  onToggleCollapse,
  onMobileOpen,
}: HeaderProps) => {
  const meUserStr = JSON.parse(localStorage.getItem("meUser")!!);
  const userEmail = meUserStr?.email;
  const meAvatar = meUserStr?.avatar;

  const theme = useTheme();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { selectedTeam } = useTeamContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new CustomEvent("sessionExpired"));
    handleMenuClose();
  };

  return (
    <header className="header">
      <div className="header__left">
        {isMobile && (
          <IconButton
            className="header__mobile-menu-btn"
            onClick={onMobileOpen}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        )}
        {!isMobile && (
          <IconButton
            className="header__collapse-btn"
            onClick={onToggleCollapse}
            size="small"
          >
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
        <Typography className="header__title">
          {selectedTeam ? selectedTeam.name : "Dashboard"}
        </Typography>
      </div>

      <div className="header__right">
        <Avatar
          className="header__avatar"
          src={meAvatar || undefined}
          onClick={handleAvatarClick}
        />
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 180,
                mt: 1,
              },
            },
          }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {userEmail || "usuario@devpulse.com"}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setProfileModalOpen(true);
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </header>
  );
};

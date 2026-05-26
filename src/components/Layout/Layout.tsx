import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const mainClass = `layout-main${collapsed && !isMobile ? " layout-main--collapsed" : ""}`;

  return (
    <div className="layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={mainClass}>
        <Header
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onMobileOpen={() => setMobileOpen(true)}
        />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

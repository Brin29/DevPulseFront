import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, width: "100%" }}>
      <Outlet />
    </Box>
  );
};

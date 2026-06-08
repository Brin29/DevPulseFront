import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

export const PublicLayout = () => {
  const authUserStr = JSON.parse(localStorage.getItem("authMe")!!);

  if (authUserStr) {
    const accessToken = authUserStr.access_token;
    const refreshToken = authUserStr.refresh_token;

    if (accessToken && refreshToken) {
      return <Navigate to="/dashboard" replace/>;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        width: "100%",
      }}
    >
      <Outlet />
    </Box>
  );
};

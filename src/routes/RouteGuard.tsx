import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RouteGuard = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/request-code",
    "/verify-code",
    "/detected-account",
    "/magic-login",
  ];

  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  const authMeStr = localStorage.getItem("authMe");
  if (!authMeStr) {
    console.warn("⚠️ No hay sesión activa, redirigiendo a inicio de sesión");
    return <Navigate to="/sign-in" replace />;
  }
};

export default RouteGuard;
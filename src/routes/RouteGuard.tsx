import type { JSX } from "react";
import { matchPath, Navigate, useLocation } from "react-router-dom";

const RouteGuard = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/request-code",
    "/verify-code",
    "/detected-account",
    "/magic-login",
    "/teams/invitations/:token/accept",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    matchPath(route, location.pathname),
  );

  if (isPublicRoute) {
    return children;
  }

  const authMeStr = localStorage.getItem("authMe");

  if (!authMeStr) {
    console.warn("No hay sesión activa, redirigiendo a inicio de sesión");
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default RouteGuard;

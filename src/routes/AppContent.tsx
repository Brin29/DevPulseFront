import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { SignIn } from "../pages/SignIn/SignIn";
import { SignUp } from "../pages/SignUp/SignUp";
import { DetectedAccount } from "../pages/DetectedAccount/DetectedAccount";
import { VerificationCode } from "../pages/VerificationCode/VerificationCode";
import { RequestCode } from "../pages/RequestCode/RequestCode";
import { MagicLogin } from "../pages/MagicLogin/MagicLogin";
import { OAuthSuccess } from "../pages/OAuthSuccess/OAuthSuccess";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { useEffect } from "react";
import RouteGuard from "./RouteGuard";
import { Layout } from "../components/Layout/Layout";
import { Teams } from "../pages/Teams/Teams";
import { TeamDetail } from "../pages/TeamDetail/TeamDetail";
import { Tasks } from "../pages/Tasks/Tasks";
import { AcceptInvitationPage } from "../pages/TeamInvitation/AcceptInvitationPage";
import { PublicLayout } from "../components/Layout/PublicLayout";

export const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn("⏳ Sesión expirada, redirigiendo al login...");
      navigate("/sign-in", { replace: true });
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpired);
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="page">
            <main className="main">
              <Outlet />
            </main>
          </div>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route element={<PublicLayout />}>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="request-code" element={<RequestCode />} />
          <Route path="verify-code" element={<VerificationCode />} />
          <Route path="magic-login" element={<MagicLogin />} />
          <Route path="detected-account" element={<DetectedAccount />} />
          <Route path="oauth-success" element={<OAuthSuccess />} />
        </Route>
      </Route>

      <Route
        path="teams/invitations/:token/accept"
        element={<AcceptInvitationPage />}
      />
      
      <Route element={<Layout />}>
        <Route
          path="dashboard"
          element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="teams"
          element={
            <RouteGuard>
              <Teams />
            </RouteGuard>
          }
        />
        <Route
          path="teams/:id"
          element={
            <RouteGuard>
              <TeamDetail />
            </RouteGuard>
          }
        />

        <Route
          path="tasks/:id"
          element={
            <RouteGuard>
              <Tasks />
            </RouteGuard>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppContent;

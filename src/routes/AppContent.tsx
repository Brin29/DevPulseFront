import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SignIn } from "../pages/SignIn/SignIn";
import { SignUp } from "../pages/SignUp/SignUp";
import { DetectedAccount } from "../pages/DetectedAccount/DetectedAccount";
import { VerificationCode } from "../pages/VerificationCode/VerificationCode";
import { RequestCode } from "../pages/RequestCode/RequestCode";
import { MagicLogin } from "../pages/MagicLogin/MagicLogin";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { useEffect } from "react";
import RouteGuard from "./RouteGuard";

export const AppContent = () => {
  const location = useLocation();
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/request-code",
    "/verify-code",
    "/detected-account",
    "/magic-login",
  ];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  const { pathname } = location;

  const isSignInPage = pathname === "/sign-in";
  const authMeStr = localStorage.getItem("authMe");
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
    <div className="page">
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/request-code" element={<RequestCode />} />
          <Route path="/verify-code" element={<VerificationCode />} />
          <Route path="/magic-login" element={<MagicLogin />} />
          <Route path="/detected-account" element={<DetectedAccount />} />
          <Route
            path="/dashboard"
            element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default AppContent;

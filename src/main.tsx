import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4c0e7e",
      light: "#6a2b9e",
      dark: "#3a0a62",
      contrastText: "#fff",
    },
    background: {
      default: "#f9fafb",
    },
  },
  typography: {
    fontFamily: '"Poppins", Helvetica, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);

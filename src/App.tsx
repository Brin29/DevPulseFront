import { LoaderPopup } from "./components/Loader/LoaderPopup";
import { LoaderProvider, useLoader } from "./context/LoaderContext";
import AppRouter from "./routes/AppRouter";

const GlobalLoader = () => {
  const { isLoading } = useLoader();
  return isLoading ? <LoaderPopup /> : null;
};

function App() {
  return (
    <LoaderProvider>
      <AppRouter />
      <GlobalLoader />
    </LoaderProvider>
  );
}

export default App;

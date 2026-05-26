import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface LoaderContextType {
  show: () => void;
  hide: () => void;
  isLoading: boolean;
}

const LoaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const show = () => setIsLoading(true);
  const hide = () => setIsLoading(false);

  useEffect(() => {
    const onShow = () => setIsLoading(true);
    const onHide = () => setIsLoading(false);

    window.addEventListener("global-loader-show", onShow);
    window.addEventListener("global-loader-hide", onHide);

    return () => {
      window.removeEventListener("global-loader-show", onShow);
      window.removeEventListener("global-loader-hide", onHide);
    };
  }, []);

  return <LoaderContext.Provider value={{ show, hide, isLoading }}>{children}</LoaderContext.Provider>;
};

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader debe usarse dentro de LoaderProvider");
  }
  return ctx;
};

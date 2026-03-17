import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { cssTransition, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ui/error-boundary";
import "./index.css";

const slideInOutAnimation = cssTransition({
  enter: "slide-left",
  exit: "slide-right",
});
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
        <App />
        <ToastContainer
          transition={slideInOutAnimation}
          hideProgressBar
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          position="top-right"
          autoClose={4000}
        />
        <ReactQueryDevtools />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

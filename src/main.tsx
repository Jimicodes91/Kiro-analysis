import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { cssTransition, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store/index.ts";

const slideInOutAnimation = cssTransition({
  enter: "slide-left",
  exit: "slide-right",
});
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ToastContainer
            transition={slideInOutAnimation}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
            position="top-right"
            autoClose={400000}
          />
          <ReactQueryDevtools />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);

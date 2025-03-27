import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux/store/index.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer 
       newestOnTop 
        closeOnClick 
        pauseOnHover 
        draggable 
        pauseOnFocusLoss 
      />
    </BrowserRouter>
    </Provider>
  </StrictMode>
);

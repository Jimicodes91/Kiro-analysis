import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "../../assets/icons/index";
import "../../index.css";
import ToastTemplate from "./ToastTemplate";

const Toast = {
  success: (message: string) => {
    toast(
      <ToastTemplate
        message={message}
        header="Request Successful"
        icon={
          <div className="toast-icon">
            <SuccessIcon />
          </div>
        }
      />,
      {
        toastId: "customId",
        style: {
          background: "#daf1e3",
          boxShadow: "none",
          borderRadius: "8px",
        },
      }
    );
  },
  error: (message: string) => {
    toast(
      <ToastTemplate
        message={message}
        icon={
          <div className="toast-icon" style={{ fontSize: "32px" }}>
            <ErrorIcon />
          </div>
        }
      />,
      {
        toastId: "customId",
        style: {
          background: "#F6DFDF",
          boxShadow: "none",
          borderRadius: "8px",
        },
      }
    );
  },
  warning: (message: string) => {
    toast(
      <ToastTemplate
        message={message}
        icon={
          <div className="toast-icon" style={{ fontSize: "32px" }}>
            <WarningIcon />
          </div>
        }
      />,
      {
        toastId: "customId",
        style: {
          background: "#F7EACA",
          boxShadow: "none",
          borderRadius: "8px",
        },
      }
    );
  },
  info: (message: string) => {
    toast(
      <ToastTemplate
        message={message}
        icon={
          <div className="toast-icon" style={{ fontSize: "32px" }}>
            <InfoIcon />
          </div>
        }
      />,
      {
        toastId: "customId",
        style: {
          background: "#D5E2FF",
          boxShadow: "none",
          borderRadius: "8px",
        },
      }
    );
  },
};

export default Toast;

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../index.css";
import ToastTemplate from './ToastTemplate';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../../assets/icons/index';


const Toast = {
  success: (message: string) => {
    toast(<ToastTemplate message={message} icon={<div className="toast-icon"><SuccessIcon /></div>} />, {
      position: "top-right",
      autoClose: 2000,
      toastId: "customId",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      pauseOnFocusLoss: true,
      style: {
        background: "#daf1e3",
        boxShadow:'none',
        borderRadius:'8px'
      },
    });
  },
  error: (message: string) => {
    toast(<ToastTemplate message={message} icon={<div className="toast-icon" style={{ fontSize: "32px" }}><ErrorIcon /></div>} />, {
      position: "top-right",
      autoClose: 2000,
      toastId: "customId",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      pauseOnFocusLoss: true,
      style: {
        background: "#F6DFDF",
        boxShadow:'none',
        borderRadius:'8px'
      },
    });
  },
  warning: (message: string) => {
    toast(<ToastTemplate message={message} icon={<div className="toast-icon" style={{ fontSize: "32px" }}><WarningIcon /></div>} />, {
      position: "top-right",
      toastId: "customId",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      pauseOnFocusLoss: true,
      style: {
        background: "#F7EACA",
        boxShadow:'none',
        borderRadius:'8px'
      },
    });
  },
  info: (message: string) => {
    toast(<ToastTemplate message={message} icon={<div className="toast-icon" style={{ fontSize: "32px" }}><InfoIcon /></div>} />, {
      position: "top-right",
      autoClose: 4000,
      toastId: "customId",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      pauseOnFocusLoss: true,
      style: {
        background: "#D5E2FF",
        boxShadow:'none',
        borderRadius:'8px'
      },
    });
  },
};

export default Toast;
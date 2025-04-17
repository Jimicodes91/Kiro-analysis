import React from "react";
import "../../index.css";
import Heading from "../ui/heading";

const ToastTemplate = ({
  message,
  icon,
}: {
  message: string;
  icon?: React.ReactElement;
}) => {
  return (
    <div className="custom-toast space-x-2">
      {icon}
      <div className="space-y-0">
        <Heading size="h6" className="text-primary font-bold">
          Request Successful
        </Heading>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

export default ToastTemplate;

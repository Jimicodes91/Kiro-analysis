import React from "react";
import "../../index.css";
import Heading from "../ui/heading";

const ToastTemplate = ({
  message,
  icon,
  header,
}: {
  message: string;
  icon?: React.ReactElement;
  header?: string;
}) => {
  return (
    <div className="custom-toast space-x-2">
      {icon}
      <div className="space-y-0">
        {header && (
          <Heading size="h6" className="text-primary font-bold">
            {header}
          </Heading>
        )}
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

export default ToastTemplate;

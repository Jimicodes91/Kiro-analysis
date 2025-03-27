
import '../../index.css'
import React from 'react';

const ToastTemplate = ({message, icon}:{message:string; icon?:React.ReactElement}) => {
  return (
    <div className="custom-toast">
      {icon}
      <div className="divider" />
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default ToastTemplate;
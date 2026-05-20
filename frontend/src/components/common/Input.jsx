import React from "react";

const Input = ({ label, icon: Icon, className = "", ...props }) => {
  return (
    <div>
      {label ? <label className="field-label">{label}</label> : null}
      <div className="relative">
        {Icon ? <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" /> : null}
        <input className={`input-field ${Icon ? "pl-12" : ""} ${className}`} {...props} />
      </div>
    </div>
  );
};

export default Input;

import React from "react";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline"
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button type={type} className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

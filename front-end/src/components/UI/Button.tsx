import React from "react";

type ButtonVariant =
  | "primary"
  | "outline"
  | "danger"
  | "secondary"
  | "ghost";

type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition duration-200 focus:outline-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    secondary:
      "bg-gray-600 text-white hover:bg-gray-700",

    ghost:
      "text-gray-700 hover:bg-gray-100",
  };

  const sizes: Record<ButtonSize, string> = {
    sm:
      "px-3 py-1.5 text-sm",

    md:
      "px-4 py-2.5 text-sm",

    lg:
      "px-6 py-3 text-base",

    icon:
      "w-10 h-10 p-0 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
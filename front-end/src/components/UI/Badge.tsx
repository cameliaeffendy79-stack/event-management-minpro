import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  showDot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  showDot = false,
  className = "",
}) => {
  const base =
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium";

  const variants = {
    success:
      "bg-green-100 text-green-700",

    warning:
      "bg-yellow-100 text-yellow-700",

    danger:
      "bg-red-100 text-red-700",

    info:
      "bg-blue-100 text-blue-700",

    default:
      "bg-gray-100 text-gray-700",
  };

  const dotColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    default: "bg-gray-500",
  };

  return (
    <span
      className={`${base} ${variants[variant]} ${className}`}
    >
      {showDot && (
        <span
          className={`
            w-2
            h-2
            rounded-full
            ${dotColors[variant]}
          `}
        />
      )}

      {children}
    </span>
  );
};

export default Badge;
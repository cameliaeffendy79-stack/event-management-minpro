import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}



const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white/80
        backdrop-blur-xl

        border border-gray-200/60

        rounded-2xl
        p-6

        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1

        transition-all
        duration-300
        ease-out

        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
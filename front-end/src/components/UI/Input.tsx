import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      label,
      helperText,
      error,
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id ??
      label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div
        className={`flex flex-col gap-1.5 ${containerClassName}`}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full
            border
            border-gray-300
            rounded-xl
            px-4
            py-2.5
            text-sm
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            outline-none
            transition
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
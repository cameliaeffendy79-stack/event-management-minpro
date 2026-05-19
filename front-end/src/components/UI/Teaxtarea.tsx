import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      label,
      helperText,
      error,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id ??
      label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-gray-700"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full
            border
            border-gray-300
            rounded-xl
            px-4
            py-2.5
            text-sm
            resize-none
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

Textarea.displayName = "Textarea";

export default Textarea;
import React from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          w-full
          max-w-md
          p-6
        "
      >
        {title && (
          <h2 className="text-lg font-semibold mb-4">
            {title}
          </h2>
        )}

        <div className="mb-6">
          {children}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          {onConfirm && (
            <Button
              variant="primary"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
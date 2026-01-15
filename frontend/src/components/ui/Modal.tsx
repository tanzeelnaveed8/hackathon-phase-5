import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizeStyles[size]} bg-background-elevated border border-border-default rounded-xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto`}
                initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between px-6 py-4 border-b border-border-default">
                    <div className="flex-1">
                      {title && (
                        <Dialog.Title className="text-xl font-semibold text-text-primary">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="text-sm text-text-secondary mt-1">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    {showCloseButton && (
                      <Dialog.Close asChild>
                        <button
                          className="ml-4 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-border-focus"
                          aria-label="Close"
                        >
                          <X size={20} />
                        </button>
                      </Dialog.Close>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-4">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-border-default ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

ModalFooter.displayName = "ModalFooter";

export default Modal;

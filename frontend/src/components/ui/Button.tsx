import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

export type ButtonProps = Omit<HTMLMotionProps<"button">, "ref"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles: Record<string, string> = {
      primary:
        "bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to text-white hover:shadow-lg hover:shadow-indigo-500/50 focus:ring-indigo-500",
      secondary:
        "bg-background-elevated text-text-primary border border-border-default hover:border-border-focus hover:bg-background-secondary focus:ring-border-focus",
      ghost:
        "text-text-secondary hover:text-text-primary hover:bg-background-elevated focus:ring-border-focus",
      danger:
        "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/50 focus:ring-red-500",
    };

    const sizeStyles: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-base gap-2",
      lg: "px-6 py-3 text-lg gap-2.5",
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        {...props} // safe: types now compatible
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2
              className="animate-spin"
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
            />
            Loading...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;

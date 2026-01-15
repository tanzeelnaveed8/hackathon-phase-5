import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export type CardProps = Omit<HTMLMotionProps<"div">, "ref"> & {
  variant?: "default" | "elevated" | "glass";
  hover?: boolean;
  children: React.ReactNode;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      hover = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-lg transition-all duration-300";

    const variantStyles = {
      default:
        "bg-background-secondary border border-border-default",
      elevated:
        "bg-background-elevated border border-border-default shadow-lg",
      glass:
        "bg-background-elevated/60 backdrop-blur-xl border border-white/10",
    };

    const hoverStyles = hover
      ? "hover:border-border-focus hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
      : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

    return (
      <motion.div
        ref={ref}
        className={combinedClassName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 border-b border-border-default ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-lg font-semibold text-text-primary ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-sm text-text-secondary mt-1 ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 border-t border-border-default ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export default Card;

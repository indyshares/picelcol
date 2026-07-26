import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Base button primitive. Variants map to the tokens in Theme Set Up.md —
 * add more shadcn/ui components alongside this one as the UI grows.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] text-sm font-medium transition-all duration-[250ms] ease-out disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:-translate-y-0.5",
        secondary:
          "bg-[var(--surface)] text-[var(--text)] border border-[var(--primary)] hover:bg-[var(--primary)]/10",
        ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--border)]/50",
        outline: "bg-transparent border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]",
        link: "bg-transparent text-[var(--link)] underline-offset-4 hover:underline hover:text-[var(--link-hover)]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

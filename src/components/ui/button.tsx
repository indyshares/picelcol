import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Base button primitive. Variants map to the tokens in Theme Set Up.md —
 * add more shadcn/ui components alongside this one as the UI grows.
 */
export const buttonVariants = cva(
  "clay-button clay-bounce inline-flex items-center justify-center gap-2 text-sm font-medium disabled:pointer-events-none motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent)] text-[var(--accent-contrast)]",
        secondary: "bg-[var(--clay-bg-soft)] text-[var(--text)] border border-[var(--primary)]",
        ghost: "bg-transparent shadow-none text-[var(--text)] hover:bg-[var(--border)]/50",
        outline:
          "bg-[var(--clay-bg-soft)] text-[var(--text)] border border-[var(--primary)]/40 hover:border-[var(--primary)]",
        link: "bg-transparent shadow-none text-[var(--link)] underline-offset-4 hover:underline hover:text-[var(--link-hover)]",
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

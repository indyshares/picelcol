type DecorativeBlobsProps = {
  className?: string;
  variant?: "hero" | "subtle";
};

/**
 * Signature decorative element: a cluster of soft, blurred pastel blobs
 * built entirely from CSS gradients — echoes the logo's blue/pink/coral
 * palette without competing with it. Purely presentational (aria-hidden),
 * absolutely positioned by the parent.
 */
export function DecorativeBlobs({ className = "", variant = "hero" }: DecorativeBlobsProps) {
  const opacity = variant === "hero" ? 1 : 0.5;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #98D8F4 0%, transparent 70%)" }}
      />
      <div
        className="absolute -right-16 top-10 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #FFC5D6 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #FF7E5F 0%, transparent 75%)", opacity: 0.4 }}
      />
      <div
        className="absolute right-1/4 bottom-10 h-6 w-6 rounded-full"
        style={{ background: "#FFFFFF", opacity: 0.6 }}
      />
      <div
        className="absolute left-1/4 top-1/3 h-3 w-3 rounded-full"
        style={{ background: "#98D8F4", opacity: 0.8 }}
      />
      <div
        className="absolute left-1/2 top-16 h-4 w-4 rounded-full"
        style={{ background: "#FFC5D6", opacity: 0.7 }}
      />
    </div>
  );
}

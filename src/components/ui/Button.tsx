import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export type ButtonVariant = "primary" | "outline" | "quiet";
export type ButtonSize = "md" | "lg";

const BASE =
  "group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-cobalt text-white hover:bg-cobalt-bright",
  outline: "border border-line-strong text-bone hover:border-cobalt-soft hover:text-white",
  quiet: "text-bone-soft hover:text-bone",
};

const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[0.95rem]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

/**
 * Gentle magnetic pull towards the pointer.
 * Desktop only, and switched off when reduced motion is requested.
 */
function useMagnetic(ref: React.RefObject<HTMLElement | null>, strength = 0.28) {
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch || reducedMotion) return;

    const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
      moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [ref, strength, isTouch, reducedMotion]);
}

/** Sliding highlight that sweeps across the button on hover. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[120%]"
    />
  );
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  magnetic = true,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & CommonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useMagnetic(ref, magnetic ? 0.28 : 0);

  return (
    <button ref={ref} className={buttonClasses(variant, size, className)} {...rest}>
      <Sheen />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  magnetic = true,
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, magnetic ? 0.28 : 0);

  return (
    <a ref={ref} className={buttonClasses(variant, size, className)} {...rest}>
      <Sheen />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </a>
  );
}

/** Small arrow used inside buttons, decorative only. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5 transition-transform duration-300", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

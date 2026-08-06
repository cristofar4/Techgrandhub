import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Desktop cursor.
 *
 * Any element can describe the action it offers by adding a data attribute:
 *   <a data-cursor="view">   or   <div data-cursor="drag" data-cursor-label="Drag">
 *
 * The cursor reads that attribute, grows, and shows the matching label.
 * It is switched off entirely on touch devices and when reduced motion is on.
 */

const DEFAULT_LABELS: Record<string, string> = {
  link: "Open",
  view: "View",
  open: "Open",
  explore: "Explore",
  drag: "Drag",
  contact: "Contact",
  image: "Look",
};

export function CustomCursor() {
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  const enabled = !isTouch && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const dot = dotRef.current;
    if (!root || !ring || !label || !dot) return;

    document.documentElement.classList.add("cursor-hidden");

    const moveX = gsap.quickTo(root, "x", { duration: 0.32, ease: "power3.out" });
    const moveY = gsap.quickTo(root, "y", { duration: 0.32, ease: "power3.out" });

    let visible = false;

    const onMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      if (!visible) {
        visible = true;
        gsap.to(root, { opacity: 1, duration: 0.25 });
      }
    };

    const onLeave = () => {
      visible = false;
      gsap.to(root, { opacity: 0, duration: 0.2 });
    };

    const setActive = (variant: string | null, customLabel: string | null) => {
      if (variant) {
        label.textContent = customLabel ?? DEFAULT_LABELS[variant] ?? "Open";
        gsap.to(ring, {
          width: 74,
          height: 74,
          borderColor: "rgba(47, 91, 255, 0.9)",
          backgroundColor: "rgba(47, 91, 255, 0.14)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else {
        gsap.to(ring, {
          width: 26,
          height: 26,
          borderColor: "rgba(244, 241, 235, 0.45)",
          backgroundColor: "rgba(244, 241, 235, 0)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 0, scale: 0.85, duration: 0.2 });
        gsap.to(dot, { opacity: 1, duration: 0.25 });
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a[href], button",
      );
      if (!target) {
        setActive(null, null);
        return;
      }
      const variant =
        target.getAttribute("data-cursor") ?? (target.tagName === "A" ? "link" : "link");
      setActive(variant, target.getAttribute("data-cursor-label"));
    };

    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.18 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.28 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      document.documentElement.classList.remove("cursor-hidden");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([root, ring, label, dot]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120] opacity-0 will-change-transform"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div
          ref={ringRef}
          className="flex items-center justify-center rounded-full border backdrop-blur-[2px]"
          style={{
            width: 26,
            height: 26,
            borderColor: "rgba(244, 241, 235, 0.45)",
            backgroundColor: "rgba(244, 241, 235, 0)",
          }}
        >
          <span
            ref={labelRef}
            className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-bone opacity-0"
          />
        </div>
        <span
          ref={dotRef}
          className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone"
        />
      </div>
    </div>
  );
}

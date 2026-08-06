import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A word the Digital Thread stops to underline.
 *
 * The outline is a real drawn rectangle, using a normalised path length so
 * the same animation works whatever the word is or how wide it becomes.
 */
export function OutlineWord({ children, delay = 0 }: { children: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGsapEffect(
    () => {
      const rect = ref.current?.querySelector("rect");
      if (!rect) return;

      if (reducedMotion) {
        gsap.set(rect, { strokeDashoffset: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        rect,
        { strokeDashoffset: 1, opacity: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          delay,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        },
      );
    },
    ref,
    [reducedMotion, delay],
  );

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap text-bone">
      {children}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-2 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1rem)]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          rx="6"
          fill="none"
          stroke="#2f5bff"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      </svg>
    </span>
  );
}

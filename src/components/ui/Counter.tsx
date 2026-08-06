import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { formatCount } from "@/lib/utils";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** A number that counts up once, the first time it is seen. */
export function Counter({ value, prefix = "", suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGsapEffect(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reducedMotion) {
        el.textContent = `${prefix}${formatCount(value)}${suffix}`;
        return;
      }

      // Start from zero before the first paint, so the number never jumps back.
      el.textContent = `${prefix}0${suffix}`;

      const counter = { current: 0 };
      gsap.to(counter, {
        current: value,
        duration: 1.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${formatCount(counter.current)}${suffix}`;
        },
      });
    },
    ref,
    [value, prefix, suffix, reducedMotion],
  );

  return (
    <span ref={ref} className={className}>
      {`${prefix}${formatCount(value)}${suffix}`}
    </span>
  );
}

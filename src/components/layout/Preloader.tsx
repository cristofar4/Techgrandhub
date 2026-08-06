import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { brand } from "@/data/site";

/**
 * The first moment of the Digital Thread.
 *
 * The screen opens as an empty blueprint. Four construction lines arrive from
 * the edges and meet in the middle, a counter measures the build, then the
 * whole plan lifts away to reveal the hero underneath.
 */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      gsap.set(rootRef.current, { autoAlpha: 0, display: "none" });
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const progress = { value: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(rootRef.current, { display: "none" });
          onComplete();
        },
      });

      tl.fromTo(
        "[data-preload-line='horizontal']",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, stagger: 0.06 },
      )
        .fromTo(
          "[data-preload-line='vertical']",
          { scaleY: 0 },
          { scaleY: 1, duration: 0.5, stagger: 0.06 },
          "-=0.45",
        )
        .to(
          progress,
          {
            value: 100,
            duration: 0.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
              }
            },
          },
          "-=0.55",
        )
        .to("[data-preload-word]", { opacity: 1, duration: 0.3, stagger: 0.03 }, "-=0.5")
        .to("[data-preload-content]", { opacity: 0, duration: 0.25 }, "-=0.05")
        .to(rootRef.current, { yPercent: -100, duration: 0.55, ease: "power4.inOut" }, "-=0.15");
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete, reducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink-deep"
    >
      {/* Construction lines meeting at the centre. */}
      <div className="pointer-events-none absolute inset-0">
        <span
          data-preload-line="horizontal"
          className="absolute left-0 top-1/3 h-px w-full origin-left bg-line-strong"
        />
        <span
          data-preload-line="horizontal"
          className="absolute right-0 top-2/3 h-px w-full origin-right bg-line-strong"
        />
        <span
          data-preload-line="vertical"
          className="absolute left-1/4 top-0 h-full w-px origin-top bg-line-strong"
        />
        <span
          data-preload-line="vertical"
          className="absolute right-1/4 bottom-0 h-full w-px origin-bottom bg-cobalt/60"
        />
      </div>

      <div data-preload-content className="relative flex flex-col items-center gap-6">
        <p className="flex gap-[0.06em] text-2xl tracking-[-0.03em] md:text-4xl">
          {Array.from(brand.name).map((character, index) => (
            <span key={`${character}-${index}`} data-preload-word className="opacity-0">
              {character}
            </span>
          ))}
        </p>
        <span ref={counterRef} className="font-mono text-xs tracking-[0.3em] text-silver">
          000
        </span>
      </div>
    </div>
  );
}

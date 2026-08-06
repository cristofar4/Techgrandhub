import { useRef, type ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type RevealMode = "words" | "chars";

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Words rise out of a mask. Characters assemble from scattered fragments. */
  mode?: RevealMode;
  /** Wait before the reveal starts, in seconds. */
  delay?: number;
  stagger?: number;
  /**
   * "scroll" plays when the text enters the viewport.
   * "immediate" plays as soon as `play` becomes true, used by the hero.
   */
  trigger?: "scroll" | "immediate";
  play?: boolean;
}

/**
 * Text that arrives rather than simply appearing.
 *
 * The visible copy is split into spans for animation, while the original
 * sentence stays available to screen readers through an accessible label,
 * so the reveal never costs anything in readability.
 */
export function RevealText({
  text,
  as: Tag = "span",
  className,
  mode = "words",
  delay = 0,
  stagger,
  trigger = "scroll",
  play = true,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGsapEffect(
    () => {
      if (reducedMotion) return;
      if (trigger === "immediate" && !play) return;

      const targets = ref.current?.querySelectorAll<HTMLElement>("[data-reveal-part]");
      if (!targets || targets.length === 0) return;

      if (mode === "words") {
        gsap.fromTo(
          targets,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.05,
            ease: "power4.out",
            delay,
            stagger: stagger ?? 0.055,
            ...(trigger === "scroll"
              ? {
                  scrollTrigger: {
                    trigger: ref.current,
                    start: "top 88%",
                    once: true,
                  },
                }
              : {}),
          },
        );
        return;
      }

      // Characters assemble from scattered interface fragments.
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          yPercent: () => gsap.utils.random(-90, 90),
          xPercent: () => gsap.utils.random(-40, 40),
          rotate: () => gsap.utils.random(-14, 14),
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: 1.15,
          ease: "power4.out",
          delay,
          stagger: { each: stagger ?? 0.035, from: "random" },
          ...(trigger === "scroll"
            ? { scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } }
            : {}),
        },
      );
    },
    ref,
    [reducedMotion, play, trigger, mode, text],
  );

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {mode === "words"
        ? words.map((word, index) => (
            // The space stays outside the mask, so the sentence keeps real
            // word spacing for selection, search engines, and screen readers.
            <span key={`${word}-${index}`}>
              <span className="line-mask inline-block overflow-hidden">
                <span data-reveal-part className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
              {index < words.length - 1 ? " " : null}
            </span>
          ))
        : [
            // Characters are decorative fragments, so the whole word is also
            // provided once for assistive technology.
            <span key="accessible-copy" className="sr-only">
              {text}
            </span>,
            ...Array.from(text).map((character, index) => (
              <span
                key={`${character}-${index}`}
                data-reveal-part
                aria-hidden="true"
                className="inline-block will-change-transform"
              >
                {character === " " ? "\u00A0" : character}
              </span>
            )),
          ]}
    </Tag>
  );
}

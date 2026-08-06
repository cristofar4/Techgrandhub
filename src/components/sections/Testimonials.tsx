import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { testimonials } from "@/data/testimonials";
import { imageSrc, imageSrcSet } from "@/data/images";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Testimonials.
 *
 * A controlled story rather than a carousel that moves on its own. The visitor
 * decides when to advance. The outgoing quote is masked away, the portrait
 * slides behind it, and the next quote rises into the same frame.
 */
export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const mounted = useRef(false);

  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const threadRef = useThreadAnchor(THREAD_ORDER.testimonials, true);

  const current = testimonials[index];

  /** Play the outgoing animation, swap the content, then bring it back in. */
  const goTo = (next: number) => {
    const target = (next + testimonials.length) % testimonials.length;
    if (target === index || animating.current) return;

    if (reducedMotion) {
      setIndex(target);
      return;
    }

    animating.current = true;
    const direction = target > index ? 1 : -1;

    gsap
      .timeline({ onComplete: () => setIndex(target) })
      .to([quoteRef.current, metaRef.current], {
        yPercent: -14 * direction,
        opacity: 0,
        duration: 0.42,
        ease: "power2.in",
        stagger: 0.05,
      })
      .to(portraitRef.current, { scale: 1.06, opacity: 0.35, duration: 0.42, ease: "power2.in" }, 0);
  };

  /* Bring the new content in once React has swapped it. */
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (reducedMotion) return;

    gsap
      .timeline({ onComplete: () => (animating.current = false) })
      .fromTo(
        [quoteRef.current, metaRef.current],
        { yPercent: 16, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.07 },
      )
      .fromTo(
        portraitRef.current,
        { scale: 1.08, opacity: 0.35, clipPath: "inset(0% 0% 100% 0%)" },
        {
          scale: 1,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );
  }, [index, reducedMotion]);

  return (
    <section ref={sectionRef} id="testimonials" aria-labelledby="testimonials-title" className="section-space relative">
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Client words"
          marker="06"
          headingId="testimonials-title"
          title="What clients say"
          titleAccent="afterwards."
        />

        <div
          className="mt-16 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16"
          aria-roledescription="Testimonial viewer"
        >
          {/* ---------------- Portrait ---------------- */}
          <div className="relative order-2 lg:order-1">
            <div
              ref={portraitRef}
              className="relative aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl border border-line"
            >
              {testimonials.map((testimonial, position) => (
                <img
                  key={testimonial.id}
                  src={imageSrc(testimonial.image, 768)}
                  srcSet={imageSrcSet(testimonial.image)}
                  sizes="(max-width: 1024px) 70vw, 30vw"
                  alt={testimonial.image.alt}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    position === index ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" />
            </div>

            <span
              aria-hidden="true"
              className="absolute -right-3 -top-3 h-16 w-16 border-r border-t border-cobalt/50"
            />
          </div>

          {/* ---------------- Quote ---------------- */}
          <div ref={threadRef} className="order-1 lg:order-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 34 24"
              className="h-6 w-8 text-cobalt"
              fill="currentColor"
            >
              <path d="M0 24V13.2C0 5.9 4.3 1.2 12 0l1.4 3.6C9.1 5 6.9 7.3 6.7 10.6H13V24H0Zm21 0V13.2C21 5.9 25.3 1.2 33 0l1.4 3.6C30.1 5 27.9 7.3 27.7 10.6H34V24H21Z" />
            </svg>

            <blockquote ref={quoteRef} className="mt-6">
              <p className="display-md font-editorial leading-[1.22] text-bone">{current.quote}</p>
            </blockquote>

            <div ref={metaRef} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="text-base text-bone">{current.name}</p>
                <p className="mt-1 text-sm text-silver">{current.business}</p>
              </div>
              <span aria-hidden="true" className="hidden h-8 w-px bg-line sm:block" />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cobalt-soft">
                {current.projectType}
              </p>
            </div>

            {/* ---------------- Controls ---------------- */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
              <div className="flex items-center gap-3">
                <ControlButton label="Previous testimonial" onClick={() => goTo(index - 1)}>
                  <path d="M10 3L5 8l5 5" />
                </ControlButton>
                <ControlButton label="Next testimonial" onClick={() => goTo(index + 1)}>
                  <path d="M6 3l5 5-5 5" />
                </ControlButton>
                <span className="ms-2 font-mono text-xs text-silver">
                  {String(index + 1).padStart(2, "0")} of {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>

              <ul className="flex flex-wrap items-center gap-2">
                {testimonials.map((testimonial, position) => (
                  <li key={testimonial.id}>
                    <button
                      type="button"
                      onClick={() => goTo(position)}
                      aria-current={position === index ? "true" : undefined}
                      aria-label={`Show the testimonial from ${testimonial.name}`}
                      data-cursor="explore"
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300",
                        position === index
                          ? "border-cobalt bg-cobalt/12 text-bone"
                          : "border-line text-silver hover:border-line-strong hover:text-bone",
                      )}
                    >
                      {testimonial.business}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor="explore"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone transition-colors duration-300 hover:border-cobalt-soft hover:text-white"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

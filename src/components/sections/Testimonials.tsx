import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { testimonials } from "@/data/testimonials";
import { imageSrc } from "@/data/images";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** First letters of each part of a name, for example Amara Okoye becomes AO. */
function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Testimonials.
 *
 * A controlled story rather than a carousel that moves on its own. The visitor
 * decides when to advance, the outgoing quote is masked away, and the next one
 * rises into the same frame.
 *
 * The words carry the section. A client is shown by their initials unless a
 * real photograph of them has been added, which keeps the layout honest while
 * the quotes are still placeholders.
 */
export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
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
        yPercent: -12 * direction,
        opacity: 0,
        duration: 0.42,
        ease: "power2.in",
        stagger: 0.05,
      })
      .to(markRef.current, { scale: 0.86, opacity: 0, duration: 0.36, ease: "power2.in" }, 0);
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
        { yPercent: 14, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.07 },
      )
      .fromTo(
        markRef.current,
        { scale: 0.86, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.05,
      );
  }, [index, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="section-space relative"
    >
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Client words"
          marker="07"
          headingId="testimonials-title"
          title="What clients say"
          titleAccent="afterwards."
        />

        <div ref={threadRef} className="mt-16">
          {/* ---------------- The quote ---------------- */}
          <div className="border-s-2 border-cobalt/60 ps-6 md:ps-10">
            <svg
              aria-hidden="true"
              viewBox="0 0 34 24"
              className="h-6 w-8 text-cobalt"
              fill="currentColor"
            >
              <path d="M0 24V13.2C0 5.9 4.3 1.2 12 0l1.4 3.6C9.1 5 6.9 7.3 6.7 10.6H13V24H0Zm21 0V13.2C21 5.9 25.3 1.2 33 0l1.4 3.6C30.1 5 27.9 7.3 27.7 10.6H34V24H21Z" />
            </svg>

            <blockquote ref={quoteRef} className="mt-6">
              <p className="max-w-4xl font-editorial text-2xl leading-[1.3] text-bone md:text-4xl md:leading-[1.25]">
                {current.quote}
              </p>
            </blockquote>

            {/* ---------------- Who said it ---------------- */}
            <div ref={metaRef} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-5">
              <div ref={markRef} className="shrink-0">
                <ClientMark testimonial={current} />
              </div>

              <div>
                <p className="text-base text-bone">{current.name}</p>
                <p className="mt-1 text-sm text-silver">{current.business}</p>
              </div>

              <span aria-hidden="true" className="hidden h-8 w-px bg-line sm:block" />

              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cobalt-soft">
                {current.projectType}
              </p>
            </div>
          </div>

          {/* ---------------- Controls ---------------- */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
            <div className="flex items-center gap-3">
              <ControlButton label="Previous testimonial" onClick={() => goTo(index - 1)}>
                <path d="M10 3L5 8l5 5" />
              </ControlButton>
              <ControlButton label="Next testimonial" onClick={() => goTo(index + 1)}>
                <path d="M6 3l5 5-5 5" />
              </ControlButton>
              <span className="ms-2 font-mono text-xs text-silver">
                {String(index + 1).padStart(2, "0")} of{" "}
                {String(testimonials.length).padStart(2, "0")}
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
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The mark beside a quote.
 *
 * A logo where there is one, a photograph where a real client has agreed to
 * it, and the client's initials where there is neither. The three sit in
 * containers of the same height, so the row never jumps as they change.
 */
function ClientMark({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  if (testimonial.logo) {
    return (
      <span className="flex h-14 items-center justify-center rounded-xl border border-line bg-bone/6 px-5">
        <img
          src={imageSrc(testimonial.logo, 320)}
          alt={testimonial.logo.alt}
          loading="lazy"
          decoding="async"
          className={cn(
            "max-h-8 w-auto max-w-36 object-contain",
            // Dark artwork would vanish on this canvas, so it is redrawn white.
            testimonial.logoInvert && "brightness-0 invert",
          )}
        />
      </span>
    );
  }

  if (testimonial.image) {
    return (
      <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-ink-raised">
        <img
          src={imageSrc(testimonial.image, 240)}
          alt={testimonial.image.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-ink-raised">
      <span aria-hidden="true" className="font-mono text-sm tracking-[0.08em] text-cobalt-soft">
        {initialsOf(testimonial.name)}
      </span>
    </span>
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
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}

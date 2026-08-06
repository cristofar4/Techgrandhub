import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { services } from "@/data/services";
import { imageSrc } from "@/data/images";
import { Figure } from "@/components/ui/Figure";
import { cn, scrollToSection } from "@/lib/utils";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowIcon } from "@/components/ui/Button";

/**
 * Services.
 *
 * An editorial index rather than a grid of cards. Each line reacts on its own:
 * the number lights up, the title steps forward, a preview follows the pointer,
 * and the detail opens in place. The thread visits every line as it descends.
 */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const showPreview = !isTouch && !reducedMotion;

  /* Rows arrive as the section is reached. */
  useGsapEffect(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        "[data-service-row]",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-service-list]", start: "top 82%", once: true },
        },
      );
    },
    sectionRef,
    [reducedMotion],
  );

  /* The floating preview tracks the pointer across the list. */
  useEffect(() => {
    if (!showPreview) return;
    const list = sectionRef.current?.querySelector<HTMLElement>("[data-service-list]");
    const preview = previewRef.current;
    if (!list || !preview) return;

    const moveX = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = list.getBoundingClientRect();
      moveX(event.clientX - rect.left);
      moveY(event.clientY - rect.top);
    };

    list.addEventListener("pointermove", onMove);
    return () => {
      list.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(preview);
    };
  }, [showPreview]);

  useEffect(() => {
    if (!showPreview) return;
    const preview = previewRef.current;
    if (!preview) return;
    gsap.to(preview, {
      opacity: hoveredId ? 1 : 0,
      scale: hoveredId ? 1 : 0.86,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [hoveredId, showPreview]);

  /* Opening a service expands its detail in place. */
  const toggle = useCallback(
    (id: string) => {
      setOpenId((current) => (current === id ? null : id));
    },
    [],
  );

  useEffect(() => {
    const panels = sectionRef.current?.querySelectorAll<HTMLElement>("[data-service-panel]");
    if (!panels) return;

    panels.forEach((panel) => {
      const isOpen = panel.dataset.serviceOpen === "true";
      if (reducedMotion) {
        gsap.set(panel, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
        return;
      }
      gsap.to(panel, {
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
  }, [openId, reducedMotion]);

  return (
    <section ref={sectionRef} id="services" aria-labelledby="services-title" className="section-space relative">
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Services"
          marker="02"
          headingId="services-title"
          title="Six ways I can build"
          titleAccent="what you need."
          lead="Every engagement is scoped around a result, not a page count. Select a service to see what it includes."
        />

        <div data-service-list className="relative mt-16">
          {/* Floating preview, desktop only. */}
          {showPreview ? (
            <div
              ref={previewRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-20 hidden h-56 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-line-strong opacity-0 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] lg:block"
            >
              {services.map((service) => (
                <img
                  key={service.id}
                  src={imageSrc(service.image, 768)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    hoveredId === service.id ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <span className="absolute inset-0 bg-ink/25" />
            </div>
          ) : null}

          <ul className="border-t border-line">
            {services.map((service, index) => (
              <ServiceRow
                key={service.id}
                index={index}
                service={service}
                open={openId === service.id}
                onToggle={() => toggle(service.id)}
                onHover={setHoveredId}
              />
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="text-sm text-silver">
            Not sure which one fits? Describe the goal and I will recommend the right approach.
          </p>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            data-cursor="contact"
            className="group inline-flex items-center gap-2 text-sm text-cobalt-soft transition-colors hover:text-bone"
          >
            Ask about your project
            <ArrowIcon className="group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

interface ServiceRowProps {
  service: (typeof services)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
  onHover: (id: string | null) => void;
}

function ServiceRow({ service, index, open, onToggle, onHover }: ServiceRowProps) {
  // Waypoints alternate side to side, so the thread weaves between the lines.
  const threadRef = useThreadAnchor(THREAD_ORDER.services + index, index % 2 === 1);
  const panelId = `service-panel-${service.id}`;

  return (
    <li className="border-b border-line" data-service-row>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          onPointerEnter={() => onHover(service.id)}
          onPointerLeave={() => onHover(null)}
          onFocus={() => onHover(service.id)}
          onBlur={() => onHover(null)}
          aria-expanded={open}
          aria-controls={panelId}
          data-cursor="explore"
          data-cursor-label={open ? "Close" : "Open"}
          className="group flex w-full items-center gap-5 py-7 text-left md:gap-10 md:py-9"
        >
          <span
            ref={index % 2 === 0 ? threadRef : undefined}
            className={cn(
              "font-mono text-xs transition-colors duration-300",
              open ? "text-cobalt-soft" : "text-silver-dim group-hover:text-cobalt-soft",
            )}
          >
            {service.index}
          </span>

          <span className="flex-1">
            <span
              className={cn(
                "display-md block text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-3",
                open && "md:translate-x-3",
              )}
            >
              {service.title}
            </span>
            <span className="mt-2 block max-w-xl text-sm leading-relaxed text-silver md:text-[0.95rem]">
              {service.description}
            </span>
          </span>

          <span
            ref={index % 2 === 1 ? threadRef : undefined}
            aria-hidden="true"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
              open
                ? "rotate-45 border-cobalt-soft text-cobalt-soft"
                : "border-line text-silver group-hover:border-cobalt-soft group-hover:text-bone",
            )}
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
              <path d="M7 1v12M1 7h12" />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        data-service-panel
        data-service-open={open}
        role="region"
        aria-label={`${service.title} details`}
        className="h-0 overflow-hidden opacity-0"
      >
        <div className="grid gap-8 pb-10 md:grid-cols-[1fr_1.1fr] md:gap-12 md:ps-[4.5rem]">
          <ul className="grid gap-3 self-start">
            {service.deliverables.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-bone-soft">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-cobalt" />
                {item}
              </li>
            ))}
          </ul>
          <Figure
            asset={service.image}
            ratio={16 / 9}
            sizes="(max-width: 768px) 90vw, 40vw"
            className="rounded-xl border border-line"
          />
        </div>
      </div>
    </li>
  );
}

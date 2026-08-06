import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { brand } from "@/data/site";
import { heroLens, heroPrimary } from "@/data/images";
import { scrollToSection } from "@/lib/utils";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { RevealText } from "@/components/ui/RevealText";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Figure } from "@/components/ui/Figure";

/**
 * Hero.
 *
 * The section is assembled rather than faded in. Construction lines arrive
 * from the edges and lock into a frame, the brand name gathers itself out of
 * scattered fragments, the headline rises through a mask, and the photograph
 * is uncovered by a glass lens that travels a curved motion path across it.
 * Once the lens settles it follows the pointer instead.
 */
export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<SVGSVGElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const tickerAttached = useRef(false);

  const threadStart = useThreadAnchor(THREAD_ORDER.heroStart);
  const threadExit = useThreadAnchor(THREAD_ORDER.heroExit, true);

  /** Keep the revealed layer aligned with the lens on every frame. */
  const syncMask = useCallback(() => {
    const lens = lensRef.current;
    const mask = maskRef.current;
    if (!lens || !mask) return;
    const x = Number(gsap.getProperty(lens, "x"));
    const y = Number(gsap.getProperty(lens, "y"));
    mask.style.setProperty("--lens-x", `${x}px`);
    mask.style.setProperty("--lens-y", `${y}px`);
  }, []);

  /** The mask sync runs on the GSAP ticker only while the lens is moving. */
  const attachTicker = useCallback(() => {
    if (tickerAttached.current) return;
    tickerAttached.current = true;
    gsap.ticker.add(syncMask);
  }, [syncMask]);

  const detachTicker = useCallback(() => {
    if (!tickerAttached.current) return;
    tickerAttached.current = false;
    gsap.ticker.remove(syncMask);
  }, [syncMask]);

  /* ----------------------------------------------------------------------
     Entrance sequence
     ---------------------------------------------------------------------- */
  useGsapEffect(
    () => {
      if (!ready) return;

      if (reducedMotion) {
        gsap.set(
          [
            "[data-hero-frame] path",
            "[data-hero-eyebrow]",
            "[data-hero-copy]",
            "[data-hero-actions]",
            "[data-hero-actions] > *",
            "[data-hero-status]",
            "[data-hero-media]",
            "[data-hero-scroll]",
          ],
          { opacity: 1, clearProps: "transform" },
        );
        gsap.set("[data-hero-frame] path", { strokeDashoffset: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Construction lines travel in from the edges and meet.
      const lines = frameRef.current?.querySelectorAll<SVGPathElement>("path");
      lines?.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
      });

      if (lines && lines.length > 0) {
        tl.to(lines, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.inOut",
          stagger: 0.07,
        });
      }

      // 2. The copy arrives while the frame is still being drawn, so nothing
      //    important waits on decoration.
      tl.fromTo(
        "[data-hero-eyebrow]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.1,
      )
        .fromTo(
          "[data-hero-copy]",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          0.2,
        )
        .fromTo(
          "[data-hero-actions] > *",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
          0.55,
        )
        .fromTo("[data-hero-status]", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.7)
        .fromTo(
          "[data-hero-media]",
          { clipPath: "inset(0% 0% 100% 0%)", opacity: 1 },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut" },
          0.15,
        )
        .fromTo(
          "[data-hero-scroll]",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.85,
        );

    },
    sectionRef,
    [ready, reducedMotion],
  );

  /* ----------------------------------------------------------------------
     The glass lens: first a guided journey, then it follows the pointer.
     ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!ready || reducedMotion) return;

    const media = mediaRef.current;
    const lens = lensRef.current;
    const mask = maskRef.current;
    if (!media || !lens || !mask) return;

    const bounds = media.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    if (width === 0 || height === 0) return;

    // A curved route across the photograph, described in local coordinates.
    const route = [
      { x: width * 0.12, y: height * 0.82 },
      { x: width * 0.3, y: height * 0.36 },
      { x: width * 0.58, y: height * 0.68 },
      { x: width * 0.82, y: height * 0.26 },
      { x: width * 0.62, y: height * 0.5 },
    ];

    const ctx = gsap.context(() => {
      gsap.set(lens, { xPercent: -50, yPercent: -50, x: route[0].x, y: route[0].y, opacity: 0 });
      gsap.set(mask, { opacity: 0 });
      syncMask();
      attachTicker();

      const tl = gsap.timeline({ delay: 0.6 });

      tl.to([lens, mask], { opacity: 1, duration: 0.45, ease: "power2.out" })
        .to(
          lens,
          {
            duration: 2.6,
            ease: "power2.inOut",
            motionPath: { path: route, curviness: 1.4, autoRotate: false },
          },
          "<",
        )
        .to(lens, { scale: 0.92, duration: 0.5, ease: "power2.out" }, "-=0.4");
    }, media);

    return () => {
      detachTicker();
      ctx.revert();
    };
  }, [ready, reducedMotion, syncMask, attachTicker, detachTicker]);

  /* Pointer control, desktop only. */
  useEffect(() => {
    if (reducedMotion || isTouch) return;
    const media = mediaRef.current;
    const lens = lensRef.current;
    const mask = maskRef.current;
    if (!media || !lens || !mask) return;

    const moveX = gsap.quickTo(lens, "x", { duration: 0.45, ease: "power3.out" });
    const moveY = gsap.quickTo(lens, "y", { duration: 0.45, ease: "power3.out" });

    const onEnter = () => {
      gsap.killTweensOf(lens);
      attachTicker();
      gsap.to([lens, mask], { opacity: 1, duration: 0.3 });
      gsap.to(lens, { scale: 1, duration: 0.4, ease: "power3.out" });
    };

    const onMove = (event: PointerEvent) => {
      const rect = media.getBoundingClientRect();
      moveX(event.clientX - rect.left);
      moveY(event.clientY - rect.top);
    };

    const onLeave = () => {
      gsap.to(lens, { scale: 0.9, duration: 0.5, ease: "power3.out" });
      gsap.to([lens, mask], {
        opacity: 0.45,
        duration: 0.5,
        onComplete: detachTicker,
      });
    };

    media.addEventListener("pointerenter", onEnter);
    media.addEventListener("pointermove", onMove);
    media.addEventListener("pointerleave", onLeave);

    return () => {
      media.removeEventListener("pointerenter", onEnter);
      media.removeEventListener("pointermove", onMove);
      media.removeEventListener("pointerleave", onLeave);
      detachTicker();
    };
  }, [reducedMotion, isTouch, attachTicker, detachTicker]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-32 md:pb-20 md:pt-36 lg:pb-16 lg:pt-32"
    >
      {/* Construction lines that assemble the hero structure. */}
      <svg
        ref={frameRef}
        data-hero-frame
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path d="M0 22 H100" stroke="rgba(244,241,235,0.09)" strokeWidth="0.12" vectorEffect="non-scaling-stroke" opacity="0" />
        <path d="M0 78 H100" stroke="rgba(244,241,235,0.09)" strokeWidth="0.12" vectorEffect="non-scaling-stroke" opacity="0" />
        <path d="M58 0 V100" stroke="rgba(47,91,255,0.35)" strokeWidth="0.12" vectorEffect="non-scaling-stroke" opacity="0" />
        <path d="M8 0 V100" stroke="rgba(244,241,235,0.07)" strokeWidth="0.12" vectorEffect="non-scaling-stroke" opacity="0" />
      </svg>

      <div className="shell relative z-10 grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* ---------------- Copy ---------------- */}
        <div className="max-w-2xl">
          <div data-hero-eyebrow className="flex flex-wrap items-center gap-x-5 gap-y-3 opacity-0">
            <RevealText
              text={brand.name}
              mode="chars"
              trigger="immediate"
              play={ready}
              delay={0.15}
              className="font-mono text-[0.7rem] uppercase tracking-[0.34em] text-cobalt-soft"
            />
            <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
            <span className="eyebrow">{brand.role}</span>
          </div>

          <h1
            id="hero-title"
            data-hero-copy
            className="display-xl mt-7 text-bone opacity-0"
          >
            <RevealText text="I build websites that make brands" trigger="immediate" play={ready} delay={0.24} />{" "}
            <RevealText
              text="impossible to ignore."
              trigger="immediate"
              play={ready}
              delay={0.34}
              className="font-editorial italic text-cobalt-soft"
            />
          </h1>

          <p data-hero-copy className="mt-7 max-w-lg text-base leading-relaxed text-bone-soft opacity-0 md:text-lg">
            TechGrandHub creates fast, responsive, and visually engaging websites designed to turn
            ideas into memorable digital experiences.
          </p>

          <div data-hero-actions className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              data-cursor="contact"
              data-cursor-label="Start"
              className="opacity-0"
            >
              Start a Project
              <ArrowIcon className="group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("projects")}
              data-cursor="explore"
              className="opacity-0"
            >
              Explore My Work
            </Button>
          </div>

          <div
            data-hero-status
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 opacity-0"
          >
            <span className="inline-flex items-center gap-2.5 text-sm text-bone-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              {brand.availability}
            </span>
            <span ref={threadStart} className="text-sm text-silver">
              {brand.location}
            </span>
          </div>
        </div>

        {/* ---------------- Media ---------------- */}
        <div data-hero-media className="relative mx-auto w-full max-w-md opacity-0 lg:mx-0 lg:max-w-none">
          <div
            ref={mediaRef}
            data-cursor="image"
            data-cursor-label="Reveal"
            className="relative overflow-hidden rounded-2xl border border-line"
          >
            <Figure
              asset={heroPrimary}
              priority
              width={1440}
              sizes="(max-width: 1024px) 92vw, 42vw"
              ratio={4 / 5}
              className="rounded-2xl lg:max-h-[58vh]"
            />

            {/* The second visual layer, visible only inside the lens. */}
            <div
              ref={maskRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0"
              style={
                {
                  "--lens-x": "50%",
                  "--lens-y": "50%",
                  WebkitMaskImage:
                    "radial-gradient(circle 88px at var(--lens-x) var(--lens-y), #000 62%, transparent 100%)",
                  maskImage:
                    "radial-gradient(circle 88px at var(--lens-x) var(--lens-y), #000 62%, transparent 100%)",
                } as React.CSSProperties
              }
            >
              <Figure
                asset={heroLens}
                priority
                width={1440}
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="h-full w-full rounded-2xl"
                imgClassName="saturate-[1.15]"
              />
            </div>

            {/* The lens itself. */}
            <div
              ref={lensRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-44 w-44 rounded-full border border-cobalt-soft/60 opacity-0 shadow-[0_0_60px_rgba(47,91,255,0.28)] backdrop-blur-[1px]"
            >
              <span className="absolute inset-3 rounded-full border border-bone/10" />
              <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-cobalt-soft/70" />
              <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-cobalt-soft/70" />
            </div>

            {/* Corner brackets, the blueprint detail. */}
            <span aria-hidden="true" className="absolute left-4 top-4 h-6 w-6 border-l border-t border-cobalt-soft/50" />
            <span aria-hidden="true" className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-cobalt-soft/50" />
          </div>

          <p className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-silver-dim">
            <span>Studio view</span>
            <span aria-hidden="true">{isTouch ? "Watch the lens" : "Move across the image"}</span>
          </p>
        </div>
      </div>

      <div
        data-hero-scroll
        className="shell relative z-10 mt-14 flex items-center justify-between opacity-0"
      >
        <button
          type="button"
          onClick={() => scrollToSection("about")}
          className="group inline-flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-silver transition-colors hover:text-bone"
          data-cursor="explore"
        >
          <span ref={threadExit} className="inline-block h-9 w-px bg-linear-to-b from-cobalt to-transparent" />
          Scroll to explore
        </button>
        <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.24em] text-silver-dim md:inline">
          Since {brand.foundedYear}
        </span>
      </div>
    </section>
  );
}

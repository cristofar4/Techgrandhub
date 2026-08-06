import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { smoothPath, clamp } from "@/lib/utils";
import { useThreadRegistry } from "@/components/thread/ThreadContext";

/**
 * The Digital Thread.
 *
 * One continuous line travels the full height of the page, passing through
 * every waypoint that the sections registered. The line is drawn as the
 * visitor scrolls, and a small light travels along its leading edge.
 *
 * On phones the route is simplified: optional waypoints are dropped and the
 * curve is pulled towards a narrow rail so it never crosses the reading area.
 * When reduced motion is requested the line is simply present, calm and still.
 */
export function DigitalThread() {
  const registry = useThreadRegistry();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);

  const [geometry, setGeometry] = useState({ d: "", width: 0, height: 0 });

  /* ----------------------------------------------------------------------
     Measure the waypoints and build the route.
     ---------------------------------------------------------------------- */
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const anchors = registry.list().filter((anchor) => !(isMobile && anchor.skipOnMobile));
      if (anchors.length < 2) {
        setGeometry((current) => (current.d ? { ...current, d: "" } : current));
        return;
      }

      const viewportWidth = document.documentElement.clientWidth;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      // On phones the line hugs a narrow rail so text is never crossed.
      const railLeft = 18;
      const railRight = viewportWidth - 18;

      const points = anchors.map((anchor) => {
        const rect = anchor.el.getBoundingClientRect();
        const rawX = rect.left + rect.width / 2 + scrollX;
        const y = rect.top + rect.height / 2 + scrollY;

        if (isMobile) {
          // Pull every waypoint towards the closer edge, then clamp inside it.
          const towardsLeft = rawX < viewportWidth / 2;
          const pulled = towardsLeft
            ? Math.min(rawX, viewportWidth * 0.18)
            : Math.max(rawX, viewportWidth * 0.82);
          return { x: clamp(pulled, railLeft, railRight), y };
        }

        return { x: clamp(rawX, 12, viewportWidth - 12), y };
      });

      // Lead in and lead out, so the thread enters and leaves the page rather
      // than starting and stopping abruptly.
      const first = points[0];
      const last = points[points.length - 1];
      const route = [
        { x: first.x, y: Math.max(first.y - 220, 0) },
        ...points,
        { x: last.x, y: Math.min(last.y + 200, documentHeight) },
      ];

      const d = smoothPath(route, isMobile ? 0.32 : 0.5);

      setGeometry((current) =>
        current.d === d && current.height === documentHeight && current.width === viewportWidth
          ? current
          : { d, width: viewportWidth, height: documentHeight },
      );
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();

    const unsubscribe = registry.subscribe(schedule);
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    // The document grows and shrinks as sections open and close.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    const refreshHandler = () => schedule();
    ScrollTrigger.addEventListener("refresh", refreshHandler);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", refreshHandler);
    };
  }, [registry, isMobile]);

  /* ----------------------------------------------------------------------
     Draw the route as the page scrolls.
     ---------------------------------------------------------------------- */
  useEffect(() => {
    const path = pathRef.current;
    const ghost = ghostRef.current;
    const head = headRef.current;
    if (!path || !ghost || !head || !geometry.d) return;

    const length = path.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set([path, ghost], { strokeDasharray: length });
      gsap.set(ghost, { strokeDashoffset: 0 });

      if (reducedMotion) {
        // Calm alternative: the thread is present and complete, without motion.
        gsap.set(path, { strokeDashoffset: 0, opacity: 0.45 });
        gsap.set(head, { opacity: 0 });
        return;
      }

      gsap.set(path, { strokeDashoffset: length });

      const scrollTrigger = {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        invalidateOnRefresh: true,
      } as const;

      gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger });

      gsap.fromTo(
        head,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top+=120 top",
            toggleActions: "play none none reverse",
          },
        },
      );

      // The leading light rides the same path with the same progress, so it
      // always sits exactly on the tip of the drawn line.
      gsap.to(head, {
        ease: "none",
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        scrollTrigger,
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [geometry.d, reducedMotion]);

  if (!geometry.d) return <div ref={wrapRef} aria-hidden="true" />;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden opacity-80"
      style={{ height: geometry.height }}
    >
      <svg
        width={geometry.width}
        height={geometry.height}
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        fill="none"
        className="block"
      >
        <defs>
          <linearGradient id="thread-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f5bff" />
            <stop offset="45%" stopColor="#4d76ff" />
            <stop offset="100%" stopColor="#8ea6ff" />
          </linearGradient>
          <filter id="thread-glow" x="-160%" y="-160%" width="420%" height="420%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The planned route, always faintly visible like a construction line. */}
        <path
          ref={ghostRef}
          d={geometry.d}
          stroke="rgba(244, 241, 235, 0.07)"
          strokeWidth={1}
          strokeDasharray="4 10"
          fill="none"
        />

        {/* The thread itself. */}
        <path
          ref={pathRef}
          d={geometry.d}
          stroke="url(#thread-stroke)"
          strokeWidth={isMobile ? 1 : 1.25}
          strokeLinecap="round"
          fill="none"
          filter="url(#thread-glow)"
        />

        {/* The travelling light at the leading edge. */}
        <g ref={headRef} opacity={0}>
          <circle r={7} fill="#2f5bff" opacity={0.24} filter="url(#thread-glow)" />
          <circle r={2.6} fill="#dfe6ff" />
        </g>
      </svg>
    </div>
  );
}

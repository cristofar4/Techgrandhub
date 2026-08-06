import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { navLinks, brand, contactDetails } from "@/data/site";
import { scrollToSection } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { Logo } from "@/components/layout/Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** Focus returns here when the menu closes. */
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Mobile navigation.
 *
 * The overlay is assembled rather than slid in: four blueprint panels drop
 * into place one after another, a construction line draws across them, and
 * only then do the links rise into view. Closing takes the panels apart again.
 */
export function MobileMenu({ open, onClose, returnFocusRef }: MobileMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  /* Build the assembly timeline once, then play or reverse it. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const panels = panelsRef.current?.children;
      const items = itemsRef.current?.querySelectorAll("[data-menu-item]");
      if (!panels || !items) return;

      const tl = gsap.timeline({ paused: true });

      if (reducedMotion) {
        tl.set(root, { autoAlpha: 1 })
          .set(panels, { yPercent: 0, opacity: 1 })
          .set([items, footerRef.current, lineRef.current], { opacity: 1, yPercent: 0 });
      } else {
        tl.set(root, { autoAlpha: 1 })
          .fromTo(
            panels,
            { yPercent: -102, opacity: 0.6 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.62,
              ease: "power4.inOut",
              stagger: { each: 0.055, from: "start" },
            },
          )
          .fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, ease: "power3.inOut", transformOrigin: "left center" },
            "-=0.28",
          )
          .fromTo(
            items,
            { yPercent: 130, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06 },
            "-=0.3",
          )
          .fromTo(
            footerRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            "-=0.35",
          );
      }

      timeline.current = tl;
    }, root);

    return () => {
      ctx.revert();
      timeline.current = null;
    };
  }, [reducedMotion]);

  /* Play, reverse, lock scrolling, and manage focus. */
  useEffect(() => {
    const tl = timeline.current;
    const root = rootRef.current;
    if (!tl || !root) return;

    if (open) {
      tl.play();
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.paddingRight = scrollbar > 0 ? `${scrollbar}px` : "";
      root.querySelector<HTMLElement>("a, button")?.focus();
    } else {
      tl.reverse();
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [open]);

  /* Escape to close, and keep the keyboard inside the overlay while it is open. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        returnFocusRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = rootRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, returnFocusRef]);

  const handleNavigate = (target: string) => {
    onClose();
    returnFocusRef.current?.focus();
    // Let the closing animation begin before the page scrolls.
    window.setTimeout(() => scrollToSection(target), 220);
  };

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-[95] opacity-0 lg:hidden"
    >
      {/* The blueprint panels that assemble into the overlay surface. */}
      <div ref={panelsRef} aria-hidden="true" className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((panel) => (
          <div
            key={panel}
            className="h-full flex-1 border-e border-line bg-ink-deep last:border-e-0"
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between px-5 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <Logo compact />
          <button
            type="button"
            onClick={() => {
              onClose();
              returnFocusRef.current?.focus();
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-cobalt-soft"
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <svg aria-hidden="true" className="my-8 h-px w-full overflow-visible" viewBox="0 0 100 1" preserveAspectRatio="none">
          <line ref={lineRef} x1="0" y1="0.5" x2="100" y2="0.5" stroke="#2f5bff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        <nav aria-label="Primary" className="flex-1">
          <ul ref={itemsRef} className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <li key={link.target} className="line-mask overflow-hidden">
                <button
                  data-menu-item
                  type="button"
                  onClick={() => handleNavigate(link.target)}
                  className="flex w-full items-baseline gap-4 py-2 text-left"
                >
                  <span className="font-mono text-[0.7rem] text-silver-dim">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="display-md text-bone">{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div ref={footerRef} className="space-y-4 pt-8">
          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="inline-flex h-13 w-full items-center justify-center rounded-full bg-cobalt px-6 py-4 text-sm font-medium text-white"
          >
            Hire Me
          </button>
          <p className="text-sm text-silver">{brand.availability}</p>
          <a
            href={`mailto:${contactDetails.email}`}
            className="block text-sm text-bone-soft underline decoration-line-strong underline-offset-4"
          >
            {contactDetails.email}
          </a>
        </div>
      </div>
    </div>
  );
}

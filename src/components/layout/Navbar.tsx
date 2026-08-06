import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { navLinks } from "@/data/site";
import { cn, scrollToSection } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";

const SECTION_IDS = navLinks.map((link) => link.target);

/**
 * Fixed navigation.
 * It begins open and transparent, then compresses into a narrow glass bar as
 * soon as the visitor leaves the hero, so the page always feels uncluttered.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.to(bar, {
      paddingTop: scrolled ? 10 : 22,
      paddingBottom: scrolled ? 10 : 22,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [scrolled]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line bg-ink/72 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div ref={barRef} className="shell flex items-center justify-between py-[22px]">
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            aria-label="TechGrandHub, back to the top of the page"
            data-cursor="link"
            data-cursor-label="Top"
            className="rounded-full"
          >
            <Logo compact={scrolled} />
          </button>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = active === link.target;
                return (
                  <li key={link.target}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.target)}
                      aria-current={isActive ? "true" : undefined}
                      data-cursor="link"
                      data-cursor-label="Go"
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                        isActive ? "text-bone" : "text-silver hover:text-bone",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-cobalt transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Button
                size="md"
                onClick={() => scrollToSection("contact")}
                data-cursor="contact"
                data-cursor-label="Hire"
              >
                Hire Me
              </Button>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-cobalt-soft lg:hidden"
            >
              <span aria-hidden="true" className="flex flex-col items-end gap-[5px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-3.5 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={toggleRef} />
    </>
  );
}

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { brand, navLinks, socialLinks } from "@/data/site";
import { scrollToSection } from "@/lib/utils";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { Logo } from "@/components/layout/Logo";
import { ArrowIcon } from "@/components/ui/Button";

/** The closing statement of the website. */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGsapEffect(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        "[data-footer-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          transformOrigin: "left center",
          scrollTrigger: { trigger: footerRef.current, start: "top 92%", once: true },
        },
      );
    },
    footerRef,
    [reducedMotion],
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={footerRef} className="relative border-t border-line pb-10 pt-20 md:pt-24">
      <div className="shell relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <Logo />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-bone-soft">
              {brand.statement}
            </p>
            <p className="mt-6 text-sm text-silver">{brand.availability}</p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <nav aria-label="Footer">
              <h2 className="eyebrow">Navigate</h2>
              <ul className="mt-5 grid gap-3">
                {navLinks.map((link) => (
                  <li key={link.target}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.target)}
                      data-cursor="link"
                      className="text-sm text-silver transition-colors duration-300 hover:text-bone"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="eyebrow">Elsewhere</h2>
              <ul className="mt-5 grid gap-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      data-cursor="link"
                      data-cursor-label={link.label}
                      className="text-sm text-silver transition-colors duration-300 hover:text-bone"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          data-footer-rule
          aria-hidden="true"
          className="mt-16 h-px w-full bg-linear-to-r from-cobalt via-line-strong to-transparent"
        />

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-xs text-silver-dim">
            Copyright {year} {brand.name}. All rights reserved.
          </p>

          <button
            type="button"
            onClick={() => scrollToSection("home")}
            data-cursor="explore"
            data-cursor-label="Top"
            className="group inline-flex items-center gap-3 rounded-full border border-line px-5 py-2.5 text-xs text-bone transition-colors duration-300 hover:border-cobalt-soft"
          >
            Back to top
            <ArrowIcon className="-rotate-90 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}

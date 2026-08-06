import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { aboutDetail, aboutPortrait } from "@/data/images";
import { stats, strengths } from "@/data/stats";
import { brand } from "@/data/site";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OutlineWord } from "@/components/ui/OutlineWord";
import { Counter } from "@/components/ui/Counter";
import { Figure } from "@/components/ui/Figure";

/**
 * About.
 *
 * Here the thread slows down and marks the words that matter, then carries on
 * towards the statistics. Photographs drift gently against the scroll so the
 * section feels layered rather than flat.
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const threadWords = useThreadAnchor(THREAD_ORDER.aboutWords);
  const threadStats = useThreadAnchor(THREAD_ORDER.aboutStats);

  useGsapEffect(
    () => {
      if (reducedMotion) return;

      // Photographs move slightly slower than the page.
      gsap.utils.toArray<HTMLElement>("[data-about-parallax]").forEach((el, index) => {
        gsap.fromTo(
          el,
          { yPercent: index === 0 ? 8 : 14 },
          {
            yPercent: index === 0 ? -8 : -14,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      gsap.fromTo(
        "[data-about-strength]",
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: "[data-about-strengths]", start: "top 85%", once: true },
        },
      );

      gsap.fromTo(
        "[data-about-stat]",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: "[data-about-stats]", start: "top 88%", once: true },
        },
      );
    },
    sectionRef,
    [reducedMotion],
  );

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-title" className="section-space relative">
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="About"
          marker="01"
          headingId="about-title"
          title="Design, code, and strategy,"
          titleAccent="working as one."
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* ---------------- Statement ---------------- */}
          <div>
            <p
              ref={threadWords}
              className="display-md max-w-2xl text-bone-soft"
            >
              I create websites that do more than look good. Every project is designed to{" "}
              <OutlineWord>communicate clearly</OutlineWord>, <OutlineWord delay={0.15}>perform smoothly</OutlineWord>,
              and help the brand achieve a <OutlineWord delay={0.3}>real goal</OutlineWord>.
            </p>

            <p className="mt-8 max-w-xl leading-relaxed text-silver">
              TechGrandHub began with a simple observation: most websites are either attractive but
              slow, or fast but forgettable. I build the version that is both. Every decision, from
              the first sketch to the final deployment, is made with the business result in mind.
            </p>

            <div data-about-strengths className="mt-12">
              <h3 className="eyebrow">What I bring to a project</h3>
              <ul className="mt-6 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {strengths.map((strength) => (
                  <li
                    key={strength}
                    data-about-strength
                    className="group flex items-center gap-4 border-b border-line py-4 text-[0.95rem] text-bone-soft transition-colors duration-300 hover:text-bone"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt transition-transform duration-300 group-hover:scale-150"
                    />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------------- Portraits ---------------- */}
          <div className="relative">
            <div data-about-parallax className="relative">
              <Figure
                asset={aboutPortrait}
                sizes="(max-width: 1024px) 90vw, 38vw"
                className="rounded-2xl border border-line"
              />
              <span aria-hidden="true" className="absolute -left-3 -top-3 h-16 w-16 border-l border-t border-cobalt/50" />
            </div>

            <div
              data-about-parallax
              className="relative -mt-16 ms-auto w-2/3 sm:-mt-24 lg:-mt-20 lg:w-3/5"
            >
              <Figure
                asset={aboutDetail}
                sizes="(max-width: 1024px) 60vw, 24vw"
                className="rounded-2xl border border-line shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
              />
            </div>

            <p className="mt-8 border-s border-line ps-5 font-editorial text-lg italic text-silver">
              {brand.location}. Building on the web since {brand.foundedYear}.
            </p>
          </div>
        </div>

        {/* ---------------- Statistics ---------------- */}
        <div
          data-about-stats
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} data-about-stat className="bg-ink px-6 py-9 sm:px-8 sm:py-11">
              <p
                ref={index === 0 ? threadStats : undefined}
                className="font-mono text-3xl text-bone sm:text-4xl"
              >
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-sm leading-snug text-silver">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

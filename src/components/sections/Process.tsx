import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { processStages } from "@/data/process";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Development process.
 *
 * This is where the Digital Thread stops being decoration and becomes
 * structure: every stage marker is a waypoint, so the same line that has been
 * travelling down the page turns into the timeline itself. Each stage lights
 * up as the line reaches it.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGsapEffect(
    () => {
      const stages = gsap.utils.toArray<HTMLElement>("[data-process-stage]");

      if (reducedMotion) {
        stages.forEach((stage) => stage.setAttribute("data-active", "true"));
        return;
      }

      stages.forEach((stage) => {
        gsap.fromTo(
          stage,
          { opacity: 0.55, x: 14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stage,
              start: "top 78%",
              end: "bottom 40%",
              onEnter: () => stage.setAttribute("data-active", "true"),
              onLeaveBack: () => stage.setAttribute("data-active", "false"),
            },
          },
        );
      });
    },
    sectionRef,
    [reducedMotion],
  );

  return (
    <section ref={sectionRef} id="process" aria-labelledby="process-title" className="section-space relative">
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Process"
          marker="04"
          headingId="process-title"
          title="Seven stages, one"
          titleAccent="predictable path."
          lead="You always know what is happening, what comes next, and what you receive at the end of each stage."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* A short standing note, so the wide screen is never half empty. */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-base leading-relaxed text-bone-soft">
              Most website projects go wrong in the space between agreeing on an idea and seeing the
              first screen. These seven stages remove that gap.
            </p>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
              <div className="bg-ink px-6 py-5">
                <dt className="eyebrow">Typical timeline</dt>
                <dd className="mt-2 text-sm text-bone">Two to six weeks, depending on scope</dd>
              </div>
              <div className="bg-ink px-6 py-5">
                <dt className="eyebrow">You approve</dt>
                <dd className="mt-2 text-sm text-bone">The brief, the direction, and the build</dd>
              </div>
              <div className="bg-ink px-6 py-5">
                <dt className="eyebrow">After launch</dt>
                <dd className="mt-2 text-sm text-bone">Thirty days of support included</dd>
              </div>
            </dl>
          </div>

          <ol className="relative">
            {/* The quiet rail the thread travels along. */}
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-[0.9375rem] top-4 w-px bg-line md:left-[1.4375rem]"
            />

            {processStages.map((stage, index) => (
              <ProcessStageRow key={stage.id} stage={stage} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ProcessStageRow({
  stage,
  index,
}: {
  stage: (typeof processStages)[number];
  index: number;
}) {
  // Each marker is a waypoint, which is what turns the thread into the timeline.
  const threadRef = useThreadAnchor(THREAD_ORDER.process + index);

  return (
    <li
      data-process-stage
      data-active="false"
      className="group relative grid grid-cols-[2rem_1fr] gap-6 pb-12 last:pb-0 md:grid-cols-[3rem_1fr] md:gap-10 md:pb-16"
    >
      <div className="relative flex justify-start pt-1.5 md:justify-center">
        <span
          ref={threadRef}
          aria-hidden="true"
          className="relative flex h-[0.9375rem] w-[0.9375rem] items-center justify-center rounded-full border border-line-strong bg-ink transition-colors duration-500 group-data-[active=true]:border-cobalt"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-silver-dim transition-all duration-500 group-data-[active=true]:scale-125 group-data-[active=true]:bg-cobalt-soft" />
        </span>
      </div>

      <div className="pb-2">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono text-xs text-silver-dim transition-colors duration-500 group-data-[active=true]:text-cobalt-soft">
            {stage.step}
          </span>
          <h3 className="text-xl text-bone md:text-2xl">{stage.title}</h3>
        </div>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-silver md:text-[0.95rem]">
          {stage.description}
        </p>

        <p className="mt-4 inline-flex items-center gap-3 rounded-full border border-line px-4 py-1.5 text-xs text-bone-soft">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cobalt" />
          {stage.output}
        </p>
      </div>
    </li>
  );
}

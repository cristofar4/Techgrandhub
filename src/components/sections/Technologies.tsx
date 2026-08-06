import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import { technologies, technologyGroups } from "@/data/technologies";
import type { TechnologyGroup } from "@/types";
import { cn, smoothPath } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

type GroupFilter = TechnologyGroup | "all";

/**
 * Technology.
 *
 * Not a list of bars and percentages, which say nothing useful. Instead the
 * tools behave as a system: choose a purpose and the technologies that serve
 * it gather together, while a connecting line is drawn between them.
 */
export function Technologies() {
  const sectionRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLUListElement>(null);
  const linkPathRef = useRef<SVGPathElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const [group, setGroup] = useState<GroupFilter>("all");
  const [linkPath, setLinkPath] = useState("");
  const [size, setSize] = useState({ width: 0, height: 0 });

  const reducedMotion = usePrefersReducedMotion();
  const threadRef = useThreadAnchor(THREAD_ORDER.technologies);

  /** Selected purpose first, everything else after it. */
  const ordered = useMemo(() => {
    if (group === "all") return technologies;
    return [...technologies].sort((a, b) => {
      const aMatch = a.group === group ? 0 : 1;
      const bMatch = b.group === group ? 0 : 1;
      return aMatch - bMatch;
    });
  }, [group]);

  const selectGroup = (next: GroupFilter) => {
    if (next === group) return;
    if (!reducedMotion && clusterRef.current) {
      flipState.current = Flip.getState(clusterRef.current.querySelectorAll("[data-tech-chip]"));
    }
    setGroup(next);
  };

  /** Draw the connection between every technology in the selected group. */
  const measureLinks = useCallback(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const bounds = cluster.getBoundingClientRect();
    setSize({ width: bounds.width, height: bounds.height });

    if (group === "all") {
      setLinkPath("");
      return;
    }

    const points = Array.from(
      cluster.querySelectorAll<HTMLElement>(`[data-tech-group="${group}"]`),
    ).map((chip) => {
      const rect = chip.getBoundingClientRect();
      return {
        x: rect.left - bounds.left + rect.width / 2,
        y: rect.top - bounds.top + rect.height / 2,
      };
    });

    setLinkPath(points.length > 1 ? smoothPath(points, 0.35) : "");
  }, [group]);

  useLayoutEffect(() => {
    const state = flipState.current;

    if (state) {
      flipState.current = null;
      Flip.from(state, {
        duration: 0.7,
        ease: "power3.inOut",
        absolute: true,
        onComplete: () => {
          measureLinks();
          ScrollTrigger.refresh();
        },
      });
      return;
    }

    measureLinks();
  }, [group, measureLinks]);

  useEffect(() => {
    const onResize = () => measureLinks();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureLinks]);

  /* Animate the connecting line whenever it changes. */
  useEffect(() => {
    const path = linkPathRef.current;
    if (!path || !linkPath) return;

    const length = path.getTotalLength();
    if (reducedMotion) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length, opacity: 1 },
      { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
    );
    return () => {
      tween.kill();
    };
  }, [linkPath, reducedMotion]);

  const activeGroup = technologyGroups.find((entry) => entry.id === group);

  return (
    <section ref={sectionRef} id="technology" aria-labelledby="technology-title" className="section-space relative">
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Technology"
          marker="05"
          headingId="technology-title"
          title="The tools behind"
          titleAccent="every build."
          lead="Choose a purpose to see which technologies work together to serve it."
        />

        <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter technologies by purpose">
          <GroupButton active={group === "all"} onClick={() => selectGroup("all")}>
            Everything
          </GroupButton>
          {technologyGroups.map((entry) => (
            <GroupButton
              key={entry.id}
              active={group === entry.id}
              onClick={() => selectGroup(entry.id)}
            >
              {entry.label}
            </GroupButton>
          ))}
        </div>

        <p ref={threadRef} className="mt-6 min-h-[1.5rem] text-sm text-silver">
          {activeGroup ? activeGroup.description : "Ten technologies, used together on every project."}
        </p>

        <div className="relative mt-10">
          {/* The connection drawn between the selected technologies. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-0"
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width || 1} ${size.height || 1}`}
            fill="none"
          >
            <path
              ref={linkPathRef}
              d={linkPath}
              stroke="#2f5bff"
              strokeWidth={1.25}
              strokeLinecap="round"
              opacity={linkPath ? 1 : 0}
            />
          </svg>

          <ul ref={clusterRef} className="relative z-10 flex flex-wrap gap-3">
            {ordered.map((technology) => {
              const isActive = group === "all" || technology.group === group;
              return (
                <li key={technology.name}>
                  <span
                    data-tech-chip
                    data-tech-group={technology.group}
                    data-cursor="explore"
                    title={technology.note}
                    className={cn(
                      "group inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm transition-colors duration-500",
                      isActive
                        ? "border-cobalt/60 bg-cobalt/10 text-bone"
                        : "border-line bg-ink text-silver-dim",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                        isActive ? "bg-cobalt-soft" : "bg-silver-dim",
                      )}
                    />
                    {technology.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-6 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((technology) => (
            <div key={technology.name} className="flex items-baseline gap-4">
              <dt className="w-32 shrink-0 text-sm text-bone">{technology.name}</dt>
              <dd className="text-sm text-silver">{technology.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function GroupButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-cursor="explore"
      className={cn(
        "rounded-full border px-4 py-2 text-[0.8rem] transition-colors duration-300",
        active
          ? "border-cobalt bg-cobalt/12 text-bone"
          : "border-line text-silver hover:border-line-strong hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}

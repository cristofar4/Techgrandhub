import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import { projectCategories, projects } from "@/data/projects";
import { imageSrc, imageSrcSet } from "@/data/images";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink, Button, ArrowIcon } from "@/components/ui/Button";

/** Resting size of the floating preview, in pixels. */
const PREVIEW_WIDTH = 380;
const PREVIEW_HEIGHT = 250;

/**
 * Selected projects.
 *
 * Titles lead, images follow. Hovering a title brings its photograph into a
 * floating preview, and choosing a project expands that same photograph into
 * the detailed view with GSAP Flip, so the image is never reloaded and the
 * transition reads as one continuous movement.
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const detailSlotRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const [filter, setFilter] = useState<string>("All Work");
  const [hovered, setHovered] = useState<Project | null>(null);
  const [active, setActive] = useState<Project | null>(null);

  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const usePreview = !isTouch && !reducedMotion;

  const threadTop = useThreadAnchor(THREAD_ORDER.projectsTop);
  const threadBottom = useThreadAnchor(THREAD_ORDER.projectsBottom);

  const visible = useMemo(
    () => (filter === "All Work" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  /* ---------------- Entrance ---------------- */
  useGsapEffect(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        "[data-project-row]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: "[data-project-list]", start: "top 84%", once: true },
        },
      );
    },
    sectionRef,
    [reducedMotion],
  );

  /* ---------------- Filtering, animated with Flip ---------------- */
  const changeFilter = (next: string) => {
    if (next === filter) return;
    if (!reducedMotion && listRef.current) {
      flipState.current = Flip.getState(listRef.current.querySelectorAll("[data-project-row]"));
    }
    setFilter(next);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;

    Flip.from(state, {
      duration: 0.65,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(elements, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45 }),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, y: -18, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  /* ---------------- Floating preview follows the pointer ---------------- */
  useEffect(() => {
    if (!usePreview) return;
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview) return;

    const moveX = gsap.quickTo(preview, "x", { duration: 0.8, ease: "power3.out" });
    const moveY = gsap.quickTo(preview, "y", { duration: 0.8, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      if (active) return;
      moveX(event.clientX - PREVIEW_WIDTH / 2);
      moveY(event.clientY - PREVIEW_HEIGHT / 2);
    };

    list.addEventListener("pointermove", onMove);
    return () => {
      list.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(preview);
    };
  }, [usePreview, active]);

  useEffect(() => {
    if (!usePreview || active) return;
    const preview = previewRef.current;
    if (!preview) return;
    gsap.to(preview, {
      opacity: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.9,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [hovered, usePreview, active]);

  /* ---------------- Opening and closing the detailed view ---------------- */
  const openProject = useCallback(
    (project: Project, opener: HTMLElement | null) => {
      openerRef.current = opener;
      setHovered(project);
      setActive(project);
    },
    [],
  );

  const closeProject = useCallback(() => {
    setActive(null);
    openerRef.current?.focus();
  }, []);

  // When the detail view mounts, the floating preview flies into its slot.
  useLayoutEffect(() => {
    const preview = previewRef.current;
    const slot = detailSlotRef.current;

    if (!usePreview || !preview) return;

    if (active && slot) {
      gsap.set(preview, { opacity: 1, scale: 1 });
      Flip.fit(preview, slot, {
        duration: 0.75,
        ease: "power3.inOut",
        scale: false,
      });
      return;
    }

    // Closing: the preview shrinks away where it stands.
    gsap.to(preview, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(preview, {
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          scale: 0.9,
        });
      },
    });
  }, [active, usePreview]);

  /* Keyboard and scroll behaviour while the detail view is open. */
  useEffect(() => {
    if (!active) return;

    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProject();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [active, closeProject]);

  return (
    <section ref={sectionRef} id="projects" aria-labelledby="projects-title" className="section-space relative">
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Selected work"
          marker="03"
          headingId="projects-title"
          title="Websites built for"
          titleAccent="real outcomes."
          lead="A selection of recent builds across fashion, education, healthcare, technology, and business."
        />

        {/* ---------------- Filters ---------------- */}
        <div
          ref={threadTop}
          className="mt-12 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter projects by category"
        >
          {projectCategories.map((category) => {
            const isActive = filter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => changeFilter(category)}
                aria-pressed={isActive}
                data-cursor="explore"
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.8rem] transition-colors duration-300",
                  isActive
                    ? "border-cobalt bg-cobalt/12 text-bone"
                    : "border-line text-silver hover:border-line-strong hover:text-bone",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ---------------- Project list ---------------- */}
        <div data-project-list className="relative mt-10">
          <ul ref={listRef} className="border-t border-line">
            {visible.map((project) => (
              <li key={project.id} data-project-row className="border-b border-line">
                <div className="group flex items-center gap-5 py-6 md:gap-10 md:py-8">
                  {/* Inline thumbnail, used where there is no pointer to follow. */}
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line lg:hidden">
                    <img
                      src={imageSrc(project.image, 480)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={(event) => openProject(project, event.currentTarget)}
                    onPointerEnter={() => setHovered(project)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(project)}
                    onBlur={() => setHovered(null)}
                    data-cursor="view"
                    className="flex-1 text-left"
                    aria-label={`Open project details for ${project.name}`}
                  >
                    <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="display-md text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-3">
                        {project.name}
                      </span>
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">
                        {project.year}
                      </span>
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-silver">
                      {project.description}
                    </span>
                  </button>

                  <div className="hidden shrink-0 flex-col items-end gap-2 md:flex">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cobalt-soft">
                      {project.category}
                    </span>
                    <span className="text-xs text-silver-dim">
                      {project.technologies.slice(0, 3).join(", ")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p ref={threadBottom} className="mt-10 text-sm text-silver">
            {visible.length} {visible.length === 1 ? "project" : "projects"} shown.{" "}
            {filter !== "All Work" ? (
              <button
                type="button"
                onClick={() => changeFilter("All Work")}
                className="text-cobalt-soft underline decoration-line-strong underline-offset-4 hover:text-bone"
              >
                Show every project
              </button>
            ) : (
              "Select any title to open the full case."
            )}
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------------------
          The preview and the detailed view are rendered straight into the
          document body. They must sit above the fixed navigation, and a
          portal keeps them out of the page stacking context.
          ---------------------------------------------------------------- */}
      {usePreview
        ? createPortal(
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[100] overflow-hidden rounded-xl border border-line-strong opacity-0 shadow-[0_50px_120px_-50px_rgba(0,0,0,1)]"
          style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
        >
          {projects.map((project) => (
            <img
              key={project.id}
              src={imageSrc(project.image, 1080)}
              srcSet={imageSrcSet(project.image)}
              sizes="420px"
              alt=""
              loading="lazy"
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                hovered?.id === project.id ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>,
        document.body,
      )
        : null}

      {active
        ? createPortal(
            <ProjectDetail
              project={active}
              slotRef={detailSlotRef}
              closeRef={closeRef}
              onClose={closeProject}
              showSlotImage={!usePreview}
            />,
            document.body,
          )
        : null}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

interface ProjectDetailProps {
  project: Project;
  slotRef: React.RefObject<HTMLDivElement | null>;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  /** True where no floating preview exists, so the slot shows its own image. */
  showSlotImage: boolean;
}

function ProjectDetail({ project, slotRef, closeRef, onClose, showSlotImage }: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGsapEffect(
    () => {
      if (reducedMotion) {
        gsap.set("[data-detail-fade]", { opacity: 1, y: 0 });
        return;
      }
      gsap
        .timeline()
        .fromTo(
          "[data-detail-backdrop]",
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: "power2.out" },
        )
        .fromTo(
          "[data-detail-fade]",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 },
          0.3,
        );
    },
    panelRef,
    [project.id, reducedMotion],
  );

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name}, project details`}
      className="fixed inset-0 z-[105]"
    >
      <button
        data-detail-backdrop
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-deep/92 backdrop-blur-md"
        tabIndex={-1}
      />

      <div className="relative z-10 flex h-full flex-col overflow-y-auto">
        <div className="shell flex items-center justify-between py-6">
          <span data-detail-fade className="eyebrow">
            {project.category}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            data-cursor="link"
            data-cursor-label="Close"
            className="inline-flex h-11 items-center gap-3 rounded-full border border-line px-5 text-sm text-bone transition-colors hover:border-cobalt-soft"
          >
            Close
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <div className="shell grid flex-1 items-start gap-10 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* The floating preview lands exactly here. */}
          <div
            ref={slotRef}
            className="aspect-3/2 w-full overflow-hidden rounded-2xl border border-line bg-ink-raised"
          >
            {showSlotImage ? (
              <img
                src={imageSrc(project.image, 1440)}
                srcSet={imageSrcSet(project.image)}
                sizes="(max-width: 1024px) 92vw, 55vw"
                alt={project.image.alt}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div>
            <h3 data-detail-fade className="display-lg text-bone">
              {project.name}
            </h3>

            <p data-detail-fade className="mt-6 leading-relaxed text-bone-soft">
              {project.detail}
            </p>

            <dl data-detail-fade className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow">Year</dt>
                <dd className="mt-2 text-sm text-bone">{project.year}</dd>
              </div>
              <div>
                <dt className="eyebrow">Technology used</dt>
                <dd className="mt-2 text-sm text-bone">{project.technologies.join(", ")}</dd>
              </div>
            </dl>

            <div data-detail-fade className="mt-8">
              <h4 className="eyebrow">What changed</h4>
              <ul className="mt-4 grid gap-3">
                {project.results.map((result) => (
                  <li key={result} className="flex items-start gap-3 text-sm text-bone-soft">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-cobalt" />
                    {result}
                  </li>
                ))}
              </ul>
            </div>

            <div data-detail-fade className="mt-10 flex flex-wrap gap-3">
              <ButtonLink
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                data-cursor-label="Visit"
              >
                Live website
                <ArrowIcon className="group-hover:translate-x-1" />
              </ButtonLink>
              <Button variant="outline" onClick={onClose}>
                Back to projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

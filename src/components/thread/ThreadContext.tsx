import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";

/**
 * The Digital Thread registry.
 *
 * Sections do not draw the thread themselves. Instead they place invisible
 * anchor points at the exact spots the line should pass through, and the
 * DigitalThread component measures those points and draws one continuous
 * path through all of them. Adding a new waypoint anywhere on the page is
 * therefore a single line of markup.
 */

export interface ThreadAnchor {
  el: HTMLElement;
  /** Position along the thread. Lower numbers are visited first. */
  order: number;
  /** Anchors marked this way are skipped in the simplified mobile thread. */
  skipOnMobile: boolean;
}

class ThreadRegistry {
  private anchors = new Map<HTMLElement, ThreadAnchor>();
  private listeners = new Set<() => void>();

  register(anchor: ThreadAnchor): void {
    this.anchors.set(anchor.el, anchor);
    this.emit();
  }

  unregister(el: HTMLElement): void {
    if (this.anchors.delete(el)) this.emit();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Waypoints in travel order. */
  list(): ThreadAnchor[] {
    return Array.from(this.anchors.values()).sort((a, b) => a.order - b.order);
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

const ThreadContext = createContext<ThreadRegistry | null>(null);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const registry = useMemo(() => new ThreadRegistry(), []);
  return <ThreadContext.Provider value={registry}>{children}</ThreadContext.Provider>;
}

export function useThreadRegistry(): ThreadRegistry {
  const registry = useContext(ThreadContext);
  if (!registry) {
    throw new Error("Thread anchors must be used inside a ThreadProvider.");
  }
  return registry;
}

/**
 * Attach the returned ref to any element to make it a waypoint on the thread.
 *
 * @param order Position along the journey, for example 30 for the first service.
 * @param skipOnMobile Leave the waypoint out of the simplified mobile thread.
 */
export function useThreadAnchor(order: number, skipOnMobile = false) {
  const registry = useThreadRegistry();
  const current = useRef<HTMLElement | null>(null);

  // The callback identity is stable, so React only calls it when the element
  // itself mounts or unmounts rather than on every render.
  return useCallback(
    (el: HTMLElement | null) => {
      if (current.current) {
        registry.unregister(current.current);
        current.current = null;
      }
      if (el) {
        current.current = el;
        registry.register({ el, order, skipOnMobile });
      }
    },
    [registry, order, skipOnMobile],
  );
}

/** Reserved order values, kept together so the journey is easy to reason about. */
export const THREAD_ORDER = {
  heroStart: 10,
  heroExit: 15,
  aboutWords: 20,
  aboutStats: 24,
  services: 30, // service rows use 30, 31, 32 and so on
  projectsTop: 40,
  projectsBottom: 44,
  process: 50, // process stages use 50, 51, 52 and so on
  technologies: 60,
  playground: 62,
  testimonials: 66,
  contactHeading: 70,
  contactAction: 74,
} as const;

export type ThreadRegistryType = ThreadRegistry;

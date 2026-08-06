import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Run GSAP work inside a scoped context and revert it automatically.
 * Every animation and every ScrollTrigger created inside the callback is
 * cleaned up when the component unmounts or the dependencies change, which
 * keeps the page free of stale scroll instances.
 */
export function useGsapEffect(
  callback: (context: gsap.Context) => void,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
): void {
  useLayoutEffect(() => {
    if (!scope.current) return;

    const ctx = gsap.context((self) => callback(self), scope.current);
    return () => ctx.revert();
    // The scope ref identity is stable, so it is intentionally left out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

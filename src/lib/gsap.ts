/**
 * Single GSAP entry point.
 * Plugins are registered once here, then imported from this file everywhere
 * else, which keeps registration predictable and the bundle tidy.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, Flip, MotionPathPlugin);

/** House easing, shared by every timeline so the motion feels like one system. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  thread: "none",
} as const;

/** Refresh scroll positions once images and fonts have settled. */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger, Flip, MotionPathPlugin };

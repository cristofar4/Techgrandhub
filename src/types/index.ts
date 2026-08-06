/**
 * Shared content types for TechGrandHub.
 * Every content file in src/data is typed against these shapes, so editing
 * content stays safe and the editor can autocomplete the fields for you.
 */

import type { ImageAsset } from "@/data/images";

export interface NavLink {
  /** Visible label in the navigation. */
  label: string;
  /** Section id on the page, without the hash symbol. */
  target: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Short handle shown next to the label in the footer. */
  handle: string;
}

export interface Stat {
  /** Numeric target for the counting animation. */
  value: number;
  /** Text placed after the number, for example a percent sign. */
  suffix?: string;
  /** Text placed before the number. */
  prefix?: string;
  label: string;
}

export interface Service {
  id: string;
  /** Two digit index shown in the editorial layout, for example 01. */
  index: string;
  title: string;
  description: string;
  /** Short deliverables shown when a service row opens. */
  deliverables: string[];
  image: ImageAsset;
}

/** Add a new category here and the filter chips pick it up automatically. */
export type ProjectCategory =
  | "Technology Platform"
  | "Business Website"
  | "Healthcare Website"
  | "Nonprofit Website"
  | "Organisation Website"
  | "Hospitality Website"
  | "School Website"
  | "Personal Portfolio";

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  year: string;
  description: string;
  /** Longer copy shown inside the expanded project view. */
  detail: string;
  technologies: string[];
  image: ImageAsset;
  /** The live website address. */
  liveUrl: string;
  /** What stands out about the build, shown in the expanded view. */
  highlights: string[];
}

export interface ProcessStage {
  id: string;
  step: string;
  title: string;
  description: string;
  /** Short note on what you receive at the end of the stage. */
  output: string;
}

export type TechnologyGroup = "structure" | "styling" | "interaction" | "animation" | "workflow";

export interface Technology {
  name: string;
  group: TechnologyGroup;
  note: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  business: string;
  projectType: string;
  image: ImageAsset;
}

export interface ProjectTypeOption {
  value: string;
  label: string;
}

export interface BudgetOption {
  value: string;
  label: string;
}

import type { Technology, TechnologyGroup } from "@/types";

/** Group labels used by the interactive technology system. */
export const technologyGroups: Array<{
  id: TechnologyGroup;
  label: string;
  description: string;
}> = [
  {
    id: "structure",
    label: "Structure",
    description: "The foundation every page is built on, written semantically.",
  },
  {
    id: "styling",
    label: "Styling",
    description: "Visual systems that stay consistent across every screen size.",
  },
  {
    id: "interaction",
    label: "Interaction",
    description: "Logic, state, and interface behaviour that reacts to people.",
  },
  {
    id: "animation",
    label: "Animation",
    description: "Motion that guides attention instead of competing for it.",
  },
  {
    id: "workflow",
    label: "Workflow",
    description: "How the work is versioned, reviewed, delivered, and maintained.",
  },
];

export const technologies: Technology[] = [
  { name: "HTML", group: "structure", note: "Semantic markup and document structure" },
  { name: "Responsive Design", group: "structure", note: "Layouts planned for every screen" },
  { name: "CSS", group: "styling", note: "Modern layout, grid, and custom properties" },
  { name: "Tailwind CSS", group: "styling", note: "A consistent design system in code" },
  { name: "JavaScript", group: "interaction", note: "Interface behaviour and browser APIs" },
  { name: "TypeScript", group: "interaction", note: "Types that catch mistakes early" },
  { name: "React", group: "interaction", note: "Component architecture that scales" },
  { name: "GSAP", group: "animation", note: "Timelines, scroll motion, and transitions" },
  { name: "Git", group: "workflow", note: "Version control on every project" },
  { name: "GitHub", group: "workflow", note: "Code hosting, review, and deployment" },
];

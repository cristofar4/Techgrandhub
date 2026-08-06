import type { Project, ProjectCategory } from "@/types";
import { projectImages } from "@/data/images";

/**
 * Selected projects.
 * Replace the names, descriptions, technologies, and live addresses with your
 * own work. Add or remove entries freely, the layout adapts.
 */
export const projects: Project[] = [
  {
    id: "atelier",
    name: "Atelier Nova",
    category: "Fashion Website",
    year: "2025",
    description:
      "A fashion label website built around large imagery, seasonal stories, and a calm shopping journey.",
    detail:
      "Atelier Nova needed a website that felt like a printed lookbook while still selling clothing quickly. The build pairs full width editorial imagery with a lightweight product browser, so visitors move from inspiration to enquiry without losing the mood of the collection.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "GSAP"],
    image: projectImages.atelier,
    liveUrl: "https://example.com/atelier-nova",
    results: [
      "Product enquiries doubled in the first season",
      "Mobile visitors stay twice as long",
      "Collection pages load in under two seconds",
    ],
  },
  {
    id: "academy",
    name: "Northgate Academy",
    category: "School Website",
    year: "2025",
    description:
      "A school platform that guides parents through admissions and keeps the community informed.",
    detail:
      "Northgate Academy had information spread across leaflets and social media. The new website places admissions, news, staff profiles, and term dates in one clear structure, written for parents who are usually reading on a phone between other tasks.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    image: projectImages.academy,
    liveUrl: "https://example.com/northgate-academy",
    results: [
      "Admissions enquiries rose by 60 percent",
      "Office calls about term dates dropped sharply",
      "One place for every school announcement",
    ],
  },
  {
    id: "clinic",
    name: "Meridian Health",
    category: "Hospital Website",
    year: "2024",
    description:
      "A hospital website focused on clarity, reassurance, and fast access to the right department.",
    detail:
      "Healthcare visitors arrive worried and in a hurry. Meridian Health leads with department finding, visiting hours, and appointment steps, using restrained motion and high contrast typography so the content stays readable in any situation.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Accessibility"],
    image: projectImages.clinic,
    liveUrl: "https://example.com/meridian-health",
    results: [
      "Appointment requests completed more often",
      "Accessibility score of 100 in testing",
      "Department pages found in two taps",
    ],
  },
  {
    id: "platform",
    name: "Orbit Systems",
    category: "Technology Platform",
    year: "2024",
    description:
      "A product platform website that explains a technical service to a non technical audience.",
    detail:
      "Orbit Systems sells infrastructure tooling. The website translates a complex product into a sequence of plain statements, supported by an interactive diagram that shows how data moves through the platform as the visitor scrolls.",
    technologies: ["React", "TypeScript", "GSAP", "Tailwind CSS"],
    image: projectImages.platform,
    liveUrl: "https://example.com/orbit-systems",
    results: [
      "Demo requests increased by 45 percent",
      "Sales calls start further along",
      "One shared explanation across the company",
    ],
  },
  {
    id: "ledger",
    name: "Ledger Partners",
    category: "Business Landing Page",
    year: "2024",
    description:
      "A focused campaign page built to turn advertising spend into qualified consultations.",
    detail:
      "A single page with one job. Ledger Partners wanted advertising traffic to become booked consultations, so the page carries one message, a short proof section, and a form that stays within reach on every screen size.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Performance"],
    image: projectImages.ledger,
    liveUrl: "https://example.com/ledger-partners",
    results: [
      "Cost for each booking cut by a third",
      "Form completion rate above 12 percent",
      "Loads in under one second on mobile data",
    ],
  },
  {
    id: "studio",
    name: "Ayo Studio",
    category: "Personal Portfolio",
    year: "2023",
    description:
      "A designer portfolio where the work leads and the interface stays quietly out of the way.",
    detail:
      "Ayo Studio wanted a portfolio that felt personal rather than templated. Case studies open as continuous transitions instead of separate pages, so the visitor never loses their place while moving through the work.",
    technologies: ["React", "GSAP", "Tailwind CSS", "TypeScript"],
    image: projectImages.studio,
    liveUrl: "https://example.com/ayo-studio",
    results: [
      "Three new client enquiries in month one",
      "Featured in a design newsletter",
      "Case studies read to the end far more often",
    ],
  },
];

/** Filter values shown above the project list. */
export const projectCategories: Array<ProjectCategory | "All Work"> = [
  "All Work",
  ...Array.from(new Set(projects.map((project) => project.category))),
];

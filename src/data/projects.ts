import type { Project, ProjectCategory } from "@/types";
import { projectImages } from "@/data/images";

/**
 * Selected projects: real websites, at their live addresses.
 *
 * The images are screenshots of these addresses, captured by `npm run capture`.
 *
 * PLEASE READ THE DESCRIPTIONS. They were written from the project names and
 * are a starting point, not a record of what each build actually involved. You
 * know these projects, so correct anything that reads wrong, and replace the
 * `highlights` lines with the features you are actually proud of.
 */
export const projects: Project[] = [
  {
    id: "forge",
    name: "Forge",
    category: "Technology Platform",
    year: "2025",
    description:
      "A product platform website built to explain a technical tool clearly and send visitors towards signing up.",
    detail:
      "Forge needed a website that could carry a technical product without burying the visitor in jargon. The build leads with a plain statement of what the product does, then opens up the detail for the people who want it, so both a curious visitor and a technical evaluator find what they came for.",
    technologies: ["React", "JavaScript", "CSS", "Responsive Design"],
    image: projectImages.forge,
    liveUrl: "https://forge-ewi7.onrender.com",
    highlights: [
      "Clear product explanation above the fold",
      "Responsive from small phones upwards",
      "Structured for search engines from the start",
    ],
  },
  {
    id: "horizon",
    name: "Horizon Children Foundation",
    category: "Nonprofit Website",
    year: "2025",
    description:
      "A foundation website that presents the cause, the work, and the ways people can support it.",
    detail:
      "A charity website has to build trust quickly and then make helping easy. Horizon Children Foundation leads with the work itself, keeps the language plain, and places the ways to get involved where they are always within reach rather than hidden on a separate page.",
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    image: projectImages.horizon,
    liveUrl: "https://horizon-children-foundation.onrender.com",
    highlights: [
      "The cause explained before the ask",
      "Ways to support kept close at hand",
      "Readable on the low cost phones donors actually use",
    ],
  },
  {
    id: "ocmedical",
    name: "OC Medical",
    category: "Healthcare Website",
    year: "2025",
    description:
      "A medical practice website focused on services, reassurance, and getting patients to the right place quickly.",
    detail:
      "Healthcare visitors usually arrive worried and in a hurry. OC Medical puts services, contact details, and appointment steps within immediate reach, and uses high contrast typography and restrained motion so the content stays readable in any situation.",
    technologies: ["React", "CSS", "JavaScript", "Accessibility"],
    image: projectImages.ocmedical,
    liveUrl: "https://ocmedical.netlify.app",
    highlights: [
      "Services findable in a couple of taps",
      "Contact details never more than a scroll away",
      "High contrast text for readability",
    ],
  },
  {
    id: "cabello",
    name: "Salon Cabello Lounge",
    category: "Business Website",
    year: "2024",
    description:
      "A salon website built around imagery, the service list, and a direct route to booking.",
    detail:
      "Beauty is sold visually, so the layout gives the photography room to work while keeping the practical detail close by. Services and prices sit beside the imagery rather than behind it, and booking stays one tap away on every screen size.",
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    image: projectImages.cabello,
    liveUrl: "https://salon-cabello-lounge-1.onrender.com",
    highlights: [
      "Imagery led presentation",
      "Service list with pricing in plain view",
      "Booking reachable from anywhere on the page",
    ],
  },
  {
    id: "specdec",
    name: "Specdec",
    category: "Business Website",
    year: "2024",
    description:
      "A business website that presents the offer, the credibility, and the next step in one clean sequence.",
    detail:
      "Specdec needed a website that reads as established rather than new. The structure moves the visitor through what is offered, why it can be trusted, and what to do next, without asking them to hunt for any of the three.",
    technologies: ["React", "JavaScript", "CSS", "Responsive Design"],
    image: projectImages.specdec,
    liveUrl: "https://specdec.vercel.app",
    highlights: [
      "One clear message on arrival",
      "Credibility placed before the ask",
      "Fast on mobile data",
    ],
  },
  {
    id: "lcci",
    name: "LCCI Center",
    category: "Organisation Website",
    year: "2024",
    description:
      "An organisation website covering information, activities, and how to get in touch with the centre.",
    detail:
      "An organisation website serves several audiences at once, so the structure keeps each of them in mind. Information, activities, and contact routes are separated cleanly, which means nobody has to read past content meant for somebody else.",
    technologies: ["React", "CSS", "JavaScript", "Responsive Design"],
    image: projectImages.lcci,
    liveUrl: "https://lcci-center.vercel.app",
    highlights: [
      "Information organised by audience",
      "Activities and updates in one place",
      "Straightforward to keep current",
    ],
  },
  {
    id: "duryplaza",
    name: "Dury Plaza Hotel",
    category: "Hospitality Website",
    year: "2024",
    description:
      "A hotel website presenting rooms, facilities, and the enquiry route for guests planning a stay.",
    detail:
      "Guests decide with their eyes and book with their questions answered. The build gives the rooms and facilities generous visual space, then keeps rates, location, and the enquiry route immediately available so a decision never stalls.",
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    image: projectImages.duryplaza,
    liveUrl: "https://duryplazahotelsanatonia.onrender.com",
    highlights: [
      "Rooms and facilities shown at full width",
      "Enquiry route on every screen",
      "Works on the phones guests browse from",
    ],
  },
];

/** Filter values shown above the project list, built from the work itself. */
export const projectCategories: Array<ProjectCategory | "All Work"> = [
  "All Work",
  ...Array.from(new Set(projects.map((project) => project.category))),
];

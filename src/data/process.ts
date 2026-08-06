import type { ProcessStage } from "@/types";

/** The seven stages of a TechGrandHub project. */
export const processStages: ProcessStage[] = [
  {
    id: "discovery",
    step: "01",
    title: "Discovery",
    description:
      "We talk about the business, the audience, and the result the website needs to produce. No assumptions, no guesswork.",
    output: "A written brief we both agree on",
  },
  {
    id: "planning",
    step: "02",
    title: "Planning",
    description:
      "Pages, content, and priorities are mapped before any design begins, so the structure supports the goal.",
    output: "Sitemap and page outlines",
  },
  {
    id: "design",
    step: "03",
    title: "Design Direction",
    description:
      "Typography, colour, spacing, and imagery come together into a direction you can see and approve early.",
    output: "Visual direction for key pages",
  },
  {
    id: "development",
    step: "04",
    title: "Development",
    description:
      "The website is built with clean, reusable components, responsive from the first line of code.",
    output: "A working website you can review",
  },
  {
    id: "testing",
    step: "05",
    title: "Testing",
    description:
      "Every screen size, browser, form, and link is checked, alongside performance and accessibility.",
    output: "A tested, corrected build",
  },
  {
    id: "launch",
    step: "06",
    title: "Launch",
    description:
      "Hosting, domain, analytics, and search engine basics are set up, then the website goes live carefully.",
    output: "Your website, live and measured",
  },
  {
    id: "support",
    step: "07",
    title: "Support",
    description:
      "After launch I stay available for updates, improvements, and questions, so the website keeps working for you.",
    output: "Ongoing help when you need it",
  },
];

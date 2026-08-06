import type { BudgetOption, NavLink, ProjectTypeOption, SocialLink } from "@/types";

/**
 * Brand, navigation, and contact details.
 * This is the first file to edit when you make the website your own.
 */

export const brand = {
  name: "TechGrandHub",
  /** Split for the logo mark, so the accent colour lands on the second word. */
  nameParts: ["Tech", "GrandHub"] as const,
  role: "Creative Web Developer",
  tagline: "I build websites that make brands impossible to ignore.",
  statement:
    "TechGrandHub builds modern websites where strategy, design, code, and motion work together.",
  availability: "Available for selected projects",
  location: "Working with clients worldwide",
  foundedYear: 2021,
};

export const navLinks: NavLink[] = [
  { label: "Home", target: "home" },
  { label: "About", target: "about" },
  { label: "Services", target: "services" },
  { label: "Projects", target: "projects" },
  { label: "Process", target: "process" },
  { label: "Playground", target: "playground" },
  { label: "Contact", target: "contact" },
];

/**
 * Contact details.
 * Replace the address, the phone number, and every social address below.
 */
export const contactDetails = {
  email: "hello@techgrandhub.com",
  /** Digits only, in full international format, no plus sign and no spaces. */
  whatsappNumber: "2348000000000",
  /** Human readable version of the same number. */
  whatsappDisplay: "+234 800 000 0000",
  whatsappMessage: "Hello TechGrandHub, I would like to discuss a website project.",
  github: "https://github.com/techgrandhub",
  linkedin: "https://www.linkedin.com/in/techgrandhub",
  responseTime: "Replies within one business day",
};

export const socialLinks: SocialLink[] = [
  { label: "Email", href: `mailto:${contactDetails.email}`, handle: contactDetails.email },
  {
    label: "WhatsApp",
    href: `https://wa.me/${contactDetails.whatsappNumber}?text=${encodeURIComponent(
      contactDetails.whatsappMessage,
    )}`,
    handle: contactDetails.whatsappDisplay,
  },
  { label: "GitHub", href: contactDetails.github, handle: "techgrandhub" },
  { label: "LinkedIn", href: contactDetails.linkedin, handle: "techgrandhub" },
];

/** Options offered inside the contact form. */
export const projectTypeOptions: ProjectTypeOption[] = [
  { value: "business", label: "Business Website" },
  { value: "portfolio", label: "Portfolio Website" },
  { value: "school", label: "School Website" },
  { value: "landing", label: "Landing Page" },
  { value: "redesign", label: "Website Redesign" },
  { value: "frontend", label: "Frontend Development" },
  { value: "other", label: "Something else" },
];

export const budgetOptions: BudgetOption[] = [
  { value: "starter", label: "Under 500 dollars" },
  { value: "standard", label: "500 to 1,500 dollars" },
  { value: "premium", label: "1,500 to 4,000 dollars" },
  { value: "flagship", label: "Above 4,000 dollars" },
  { value: "undecided", label: "Still deciding" },
];

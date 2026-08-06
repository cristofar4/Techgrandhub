import type { Service } from "@/types";
import { serviceImages } from "@/data/images";

/** The six services presented in the editorial services list. */
export const services: Service[] = [
  {
    id: "business",
    index: "01",
    title: "Business Websites",
    description:
      "Professional websites that help businesses build trust and attract customers.",
    deliverables: [
      "Clear brand messaging",
      "Service and pricing pages",
      "Enquiry and booking forms",
      "Search engine foundations",
    ],
    image: serviceImages.business,
  },
  {
    id: "portfolio",
    index: "02",
    title: "Portfolio Websites",
    description:
      "Personal websites for developers, designers, creatives, and professionals.",
    deliverables: [
      "Case study layouts",
      "Motion led presentation",
      "Content that is simple to update",
      "Contact and hiring paths",
    ],
    image: serviceImages.portfolio,
  },
  {
    id: "school",
    index: "03",
    title: "School Websites",
    description:
      "Modern school platforms for information, admissions, communication, and student engagement.",
    deliverables: [
      "Admissions journeys",
      "News and events sections",
      "Staff and parent information",
      "Accessible on every device",
    ],
    image: serviceImages.school,
  },
  {
    id: "landing",
    index: "04",
    title: "Landing Pages",
    description:
      "Focused pages designed for campaigns, products, services, and conversions.",
    deliverables: [
      "One clear message",
      "Persuasive page structure",
      "Fast loading on mobile data",
      "Measurement ready",
    ],
    image: serviceImages.landing,
  },
  {
    id: "redesign",
    index: "05",
    title: "Website Redesign",
    description: "Complete visual and technical improvements for outdated websites.",
    deliverables: [
      "Audit of the current website",
      "New visual direction",
      "Rebuilt on modern foundations",
      "Content carried across safely",
    ],
    image: serviceImages.redesign,
  },
  {
    id: "frontend",
    index: "06",
    title: "Frontend Development",
    description: "Responsive and interactive interfaces built from existing designs.",
    deliverables: [
      "Pixel accurate builds",
      "Reusable component systems",
      "Animation and interaction work",
      "Clean handover to your team",
    ],
    image: serviceImages.frontend,
  },
];

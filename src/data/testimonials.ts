import type { Testimonial } from "@/types";
import { testimonialImages } from "@/data/images";

/**
 * Placeholder testimonials.
 * Replace the quotes, names, and businesses with real client feedback before
 * the website goes live.
 */
export const testimonials: Testimonial[] = [
  {
    id: "one",
    quote:
      "We came with a rough idea and left with a website that explains our business better than we ever did in person. Enquiries went up within the first month, and the whole process felt organised from the first call.",
    name: "Amara Okoye",
    business: "Atelier Nova",
    projectType: "Fashion Website",
    image: testimonialImages.one,
  },
  {
    id: "two",
    quote:
      "The attention to detail is the part that surprised me. Everything works on every phone we tested, the pages open instantly, and our team can find what they need without asking anyone.",
    name: "Daniel Mensah",
    business: "Ledger Partners",
    projectType: "Business Landing Page",
    image: testimonialImages.two,
  },
  {
    id: "three",
    quote:
      "Parents now find admissions information on their own, which has changed how our office works day to day. The website is calm, clear, and genuinely easy to keep up to date.",
    name: "Grace Adeyemi",
    business: "Northgate Academy",
    projectType: "School Website",
    image: testimonialImages.three,
  },
];

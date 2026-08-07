import type { Testimonial } from "@/types";

/**
 * PLACEHOLDER TESTIMONIALS. THESE PEOPLE DO NOT EXIST.
 *
 * Replace every one of them with real feedback from real clients before the
 * website goes live. Quoting invented people is the fastest way to lose the
 * trust the rest of the website is working to build.
 *
 * There is deliberately no photograph attached. Putting a stranger's face
 * beside a quote they never said turns a placeholder into a false endorsement,
 * so the layout shows initials instead. Once you have a real client, a real
 * quote, and their permission to use their picture, add an `image` to their
 * entry and it appears automatically.
 */
export const testimonials: Testimonial[] = [
  {
    id: "one",
    quote:
      "We came with a rough idea and left with a website that explains our business better than we ever did in person. Enquiries went up within the first month, and the whole process felt organised from the first call.",
    name: "Amara Okoye",
    business: "Atelier Nova",
    projectType: "Fashion Website",
  },
  {
    id: "two",
    quote:
      "The attention to detail is the part that surprised me. Everything works on every phone we tested, the pages open instantly, and our team can find what they need without asking anyone.",
    name: "Daniel Mensah",
    business: "Ledger Partners",
    projectType: "Business Landing Page",
  },
  {
    id: "three",
    quote:
      "Parents now find admissions information on their own, which has changed how our office works day to day. The website is calm, clear, and genuinely easy to keep up to date.",
    name: "Grace Adeyemi",
    business: "Northgate Academy",
    projectType: "School Website",
  },
];

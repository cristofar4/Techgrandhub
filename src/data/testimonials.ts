import type { Testimonial } from "@/types";

/**
 * PLACEHOLDER TESTIMONIALS. THESE PEOPLE DO NOT EXIST.
 *
 * Replace every one of them with real feedback from real clients before the
 * website goes live. Quoting invented people is the fastest way to lose the
 * trust the rest of the website is working to build.
 *
 * Each entry can carry the client's logo, which is the mark this section is
 * built around. Drop the artwork into public/images/clients, register it in
 * src/data/images.ts, then set `logo` on the entry here. Full instructions are
 * in public/images/clients/README.md.
 *
 * Until a logo is attached the client's initials are shown, which reads as a
 * deliberate choice rather than a gap.
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

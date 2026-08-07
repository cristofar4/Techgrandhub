/**
 * Central image registry for TechGrandHub.
 *
 * Every photograph used on the website is declared once, in this file.
 * Each entry carries the remote source, the file name to use if you download
 * the photograph into public/images, the alternative text, and the aspect
 * ratio (used to reserve space so the layout never shifts while loading).
 *
 * HOW TO SWITCH TO LOCAL IMAGES
 * 1. Download every photograph listed in public/images/README.md.
 * 2. Save each one with the exact file name shown in the `local` field below,
 *    inside the public/images folder.
 * 3. Set USE_LOCAL_IMAGES to true. Nothing else needs to change.
 */

export const USE_LOCAL_IMAGES = false;

const REMOTE_HOST = "https://images.unsplash.com/";

export interface ImageAsset {
  /** Remote photo identifier. Also forms the download address. */
  id: string;
  /** File name to use inside public/images when hosting the file yourself. */
  local: string;
  /** Descriptive alternative text, read by screen readers. */
  alt: string;
  /** Width divided by height. Used to reserve layout space. */
  ratio: number;
  /**
   * Always load from public/images, whatever USE_LOCAL_IMAGES says.
   * Project screenshots use this, because they are your own files.
   */
  localOnly?: boolean;
}

/** Widths generated for responsive loading. */
export const IMAGE_WIDTHS = [480, 768, 1080, 1440, 1920] as const;

/** Build a single source address at a given width. */
export function imageSrc(asset: ImageAsset, width = 1080): string {
  if (asset.localOnly || USE_LOCAL_IMAGES) return `/images/${asset.local}`;
  return `${REMOTE_HOST}${asset.id}?auto=format&fit=crop&w=${width}&q=72`;
}

/** Build a responsive source set so browsers download only what they need. */
export function imageSrcSet(asset: ImageAsset): string | undefined {
  if (asset.localOnly || USE_LOCAL_IMAGES) return undefined;
  return IMAGE_WIDTHS.map((w) => `${imageSrc(asset, w)} ${w}w`).join(", ");
}

/* --------------------------------------------------------------------------
   Hero
   -------------------------------------------------------------------------- */

export const heroPrimary: ImageAsset = {
  id: "photo-1498050108023-c5249f4df085",
  local: "hero-primary.jpg",
  alt: "A web developer workspace with a laptop displaying source code beside a notebook",
  ratio: 4 / 5,
};

/** Second visual layer revealed by the moving glass lens. */
export const heroLens: ImageAsset = {
  id: "photo-1551288049-bebda4e38f71",
  local: "hero-lens.jpg",
  alt: "A finished website interface with charts and navigation shown on a laptop screen",
  ratio: 4 / 5,
};

/* --------------------------------------------------------------------------
   About
   -------------------------------------------------------------------------- */

/**
 * A real photograph of the developer, stored in public/images.
 * It is marked localOnly, so it never falls back to a stock photo service.
 * To change it, replace public/images/about-portrait.jpg and update the alt
 * text below to describe the new picture.
 */
export const aboutPortrait: ImageAsset = {
  id: "",
  local: "about-portrait.jpg",
  alt: "The developer behind TechGrandHub, photographed outdoors against a bright sky",
  ratio: 4 / 5,
  localOnly: true,
};

/* --------------------------------------------------------------------------
   Services
   -------------------------------------------------------------------------- */

export const serviceImages: Record<string, ImageAsset> = {
  business: {
    id: "photo-1497366754035-f200968a6e72",
    local: "service-business.jpg",
    alt: "A modern business office interior with meeting spaces and natural light",
    ratio: 3 / 2,
  },
  portfolio: {
    id: "photo-1487017159836-4e23ece2e4cf",
    local: "service-portfolio.jpg",
    alt: "A creative desk with a laptop, sketches, and design tools arranged neatly",
    ratio: 3 / 2,
  },
  school: {
    id: "photo-1503676260728-1c00da094a0b",
    local: "service-school.jpg",
    alt: "Students studying together with laptops and books in a bright classroom",
    ratio: 3 / 2,
  },
  landing: {
    id: "photo-1460925895917-afdab827c52f",
    local: "service-landing.jpg",
    alt: "A laptop screen showing a campaign performance dashboard",
    ratio: 3 / 2,
  },
  redesign: {
    id: "photo-1454165804606-c3d57bc86b40",
    local: "service-redesign.jpg",
    alt: "A business team reviewing printed performance reports around a table",
    ratio: 3 / 2,
  },
  frontend: {
    id: "photo-1555066931-4365d14bab8c",
    local: "service-frontend.jpg",
    alt: "A developer screen filled with interface code in a dark editor",
    ratio: 3 / 2,
  },
};

/* --------------------------------------------------------------------------
   Projects
   -------------------------------------------------------------------------- */

/**
 * Screenshots of the live websites.
 *
 * These are captured from the real addresses by `npm run capture`, which
 * writes them into public/images/projects. They are always loaded from your
 * own files, never from an outside image service.
 */
function screenshot(id: string, alt: string): ImageAsset {
  return { id, local: `projects/${id}.jpg`, alt, ratio: 16 / 10, localOnly: true };
}

export const projectImages: Record<string, ImageAsset> = {
  forge: screenshot("forge", "The Forge website shown in a browser"),
  horizon: screenshot("horizon", "The Horizon Children Foundation website shown in a browser"),
  ocmedical: screenshot("ocmedical", "The OC Medical website shown in a browser"),
  cabello: screenshot("cabello", "The Salon Cabello Lounge website shown in a browser"),
  specdec: screenshot("specdec", "The Specdec website shown in a browser"),
  lcci: screenshot("lcci", "The LCCI Center website shown in a browser"),
  duryplaza: screenshot("duryplaza", "The Dury Plaza Hotel website shown in a browser"),
};

/** Every asset in one list, used by the download guide and by preloading. */
export const allImageAssets: ImageAsset[] = [
  heroPrimary,
  heroLens,
  aboutPortrait,
  ...Object.values(serviceImages),
  ...Object.values(projectImages),
];

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Formspree form id. See src/components/sections/Contact.tsx. */
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

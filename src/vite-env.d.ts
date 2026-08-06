/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Address the contact form posts to. See src/components/sections/Contact.tsx. */
  readonly VITE_FORM_ENDPOINT?: string;
  /** Access key, required only when the endpoint is Web3Forms. */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

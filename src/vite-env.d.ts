/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Formspree form id. See src/lib/enquiry.ts. */
  readonly VITE_FORMSPREE_ID?: string;
  /** Web3Forms access key. See src/lib/enquiry.ts. */
  readonly VITE_WEB3FORMS_KEY?: string;
  /** Address of your own server, if you host the form handler yourself. */
  readonly VITE_FORM_ENDPOINT?: string;
  /** Which service wins when more than one is set: formspree, web3forms, custom. */
  readonly VITE_FORM_PROVIDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Where contact enquiries are sent.
 *
 * WEB3FORMS IS THE ONE IN USE. Get an access key at https://web3forms.com by
 * entering your email address, then put it in a file named .env in the
 * project root, and in your host's environment variables:
 *
 *   VITE_WEB3FORMS_KEY=your-access-key
 *
 * The form itself does not know or care which service is behind it, so two
 * alternatives are kept ready in case you ever move:
 *
 *   Formspree        VITE_FORMSPREE_ID=abcdwxyz
 *   Your own server  VITE_FORM_ENDPOINT=https://api.yourdomain.com/enquiries
 *
 * Set none of them and the form still validates, still shows every state, and
 * writes the enquiry to the browser console so you can check it works.
 *
 * If you set more than one, VITE_FORM_PROVIDER decides which wins. Its value
 * is one of: formspree, web3forms, custom.
 */

export interface EnquiryPayload {
  fullName: string;
  email: string;
  business: string;
  projectType: string;
  budget: string;
  details: string;
}

export type ProviderName = "formspree" | "web3forms" | "custom" | "none";

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID ?? "";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? "";
const CUSTOM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? "";
const FORCED = (import.meta.env.VITE_FORM_PROVIDER ?? "").trim().toLowerCase();

/** Which service the current settings point at. */
export function activeProvider(): ProviderName {
  if (FORCED === "formspree" && FORMSPREE_ID) return "formspree";
  if (FORCED === "web3forms" && WEB3FORMS_KEY) return "web3forms";
  if (FORCED === "custom" && CUSTOM_ENDPOINT) return "custom";

  // Nothing forced, so take whichever one is configured.
  if (WEB3FORMS_KEY) return "web3forms";
  if (FORMSPREE_ID) return "formspree";
  if (CUSTOM_ENDPOINT) return "custom";
  return "none";
}

/** Fields shared by every service, named the way a person would read them. */
function readableFields(payload: EnquiryPayload) {
  return {
    name: payload.fullName,
    email: payload.email,
    business: payload.business || "Not given",
    projectType: payload.projectType,
    budget: payload.budget || "Not given",
    message: payload.details,
  };
}

async function post(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
}

/** Formspree explains refusals in an errors array. */
interface FormspreeBody {
  errors?: Array<{ message?: string }>;
}

/** Web3Forms always answers with a success flag and a message. */
interface Web3FormsBody {
  success?: boolean;
  message?: string;
}

async function sendToFormspree(payload: EnquiryPayload): Promise<void> {
  const response = await post(`https://formspree.io/f/${FORMSPREE_ID}`, {
    ...readableFields(payload),
    _subject: `New website enquiry from ${payload.fullName}`,
    _replyto: payload.email,
  });

  if (response.ok) return;

  const body: FormspreeBody = await response.json().catch(() => ({}));
  const detail = body.errors?.map((item) => item.message).filter(Boolean).join(". ");
  throw new Error(detail || `The message could not be delivered, status ${response.status}.`);
}

async function sendToWeb3Forms(payload: EnquiryPayload): Promise<void> {
  const response = await post("https://api.web3forms.com/submit", {
    access_key: WEB3FORMS_KEY,
    subject: `New website enquiry from ${payload.fullName}`,
    from_name: payload.fullName,
    replyto: payload.email,
    ...readableFields(payload),
  });

  // Web3Forms reports refusals in the body, sometimes with a normal status.
  const body: Web3FormsBody = await response.json().catch(() => ({}));

  if (response.ok && body.success !== false) return;

  throw new Error(
    body.message || `The message could not be delivered, status ${response.status}.`,
  );
}

async function sendToCustom(payload: EnquiryPayload): Promise<void> {
  const response = await post(CUSTOM_ENDPOINT, readableFields(payload));
  if (response.ok) return;

  const text = await response.text().catch(() => "");
  throw new Error(
    text.trim() || `The message could not be delivered, status ${response.status}.`,
  );
}

/**
 * Send an enquiry through whichever service is configured.
 * Throws when the service refuses, with the reason it gave.
 */
export async function sendEnquiry(payload: EnquiryPayload): Promise<void> {
  switch (activeProvider()) {
    case "formspree":
      return sendToFormspree(payload);
    case "web3forms":
      return sendToWeb3Forms(payload);
    case "custom":
      return sendToCustom(payload);
    default:
      console.info(
        "No form service configured. Set VITE_FORMSPREE_ID, VITE_WEB3FORMS_KEY, or VITE_FORM_ENDPOINT. Enquiry was:",
        payload,
      );
      await new Promise((resolve) => setTimeout(resolve, 900));
  }
}

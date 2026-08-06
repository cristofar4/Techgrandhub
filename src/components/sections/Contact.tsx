import { useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";
import { brand, budgetOptions, contactDetails, projectTypeOptions, socialLinks } from "@/data/site";
import { cn, isValidEmail } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useGsapEffect } from "@/hooks/useGsapEffect";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";

/* ==========================================================================
   FORMSPREE
   --------------------------------------------------------------------------
   The form posts to Formspree. To switch it on:

   1. Create a free account at https://formspree.io and add a new form.
   2. Formspree gives you an address like https://formspree.io/f/abcdwxyz
      The last part, abcdwxyz, is your form id.
   3. Put it in a file named .env in the project root:

        VITE_FORMSPREE_ID=abcdwxyz

   4. On Vercel or Netlify, add the same name and value under the site
      environment variables, then redeploy.
   5. Send a test message. The first one arrives with a confirmation link
      from Formspree, which you have to click once before delivery starts.

   Until the id is set the form still validates and still shows every state,
   and the enquiry is written to the browser console so you can check it.
   ========================================================================== */

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID ?? "";

interface EnquiryPayload {
  fullName: string;
  email: string;
  business: string;
  projectType: string;
  budget: string;
  details: string;
}

/** Formspree replies with this shape when it rejects a submission. */
interface FormspreeError {
  errors?: Array<{ message?: string; field?: string }>;
}

async function sendEnquiry(payload: EnquiryPayload): Promise<void> {
  if (!FORMSPREE_ID) {
    console.info(
      "No Formspree id set. Add VITE_FORMSPREE_ID to your .env file. Enquiry was:",
      payload,
    );
    await new Promise((resolve) => setTimeout(resolve, 900));
    return;
  }

  const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: payload.fullName,
      email: payload.email,
      business: payload.business || "Not given",
      projectType: payload.projectType,
      budget: payload.budget || "Not given",
      message: payload.details,
      // Shown as the subject line in the notification email.
      _subject: `New website enquiry from ${payload.fullName}`,
      // Replying to the notification replies to the sender.
      _replyto: payload.email,
    }),
  });

  if (response.ok) return;

  // Formspree explains refusals in the body, so pass that on rather than a code.
  const body: FormspreeError = await response.json().catch(() => ({}));
  const detail = body.errors?.map((item) => item.message).filter(Boolean).join(". ");

  throw new Error(
    detail && detail.length > 0
      ? detail
      : `The message could not be delivered, status ${response.status}.`,
  );
}

type FormState = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<keyof EnquiryPayload, string>>;

const EMPTY: EnquiryPayload = {
  fullName: "",
  email: "",
  business: "",
  projectType: "",
  budget: "",
  details: "",
};

/**
 * Contact.
 *
 * The end of the journey. The thread runs into the submit button, and when an
 * enquiry is accepted it closes a circle around the confirmation message.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  const [values, setValues] = useState<EnquiryPayload>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [failure, setFailure] = useState("");

  const reducedMotion = usePrefersReducedMotion();
  const threadHeading = useThreadAnchor(THREAD_ORDER.contactHeading);
  const threadAction = useThreadAnchor(THREAD_ORDER.contactAction);

  const update = (field: keyof EnquiryPayload) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const validate = (payload: EnquiryPayload): FieldErrors => {
    const found: FieldErrors = {};
    if (payload.fullName.trim().length < 2) found.fullName = "Please enter your full name.";
    if (!isValidEmail(payload.email)) found.email = "Please enter a valid email address.";
    if (!payload.projectType) found.projectType = "Please choose a project type.";
    if (payload.details.trim().length < 20) {
      found.details = "Please share at least a sentence or two about the project.";
    }
    return found;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;

    // Simple spam trap. A real visitor never fills this in.
    const honeypot = new FormData(event.currentTarget).get("company_website");
    if (typeof honeypot === "string" && honeypot.length > 0) return;

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const firstField = Object.keys(found)[0];
      sectionRef.current
        ?.querySelector<HTMLElement>(`[name="${firstField}"]`)
        ?.focus();
      return;
    }

    setState("sending");
    setFailure("");

    try {
      await sendEnquiry(values);
      setState("success");
      setValues(EMPTY);
    } catch (error) {
      setState("error");
      setFailure(
        error instanceof Error
          ? error.message
          : "The message could not be sent. Please try again or email me directly.",
      );
    }
  };

  /* The thread closes a circle around the confirmation message. */
  useGsapEffect(
    () => {
      if (state !== "success") return;
      const circle = circleRef.current;
      const panel = successRef.current;
      if (!circle || !panel) return;

      if (reducedMotion) {
        gsap.set(circle, { strokeDashoffset: 0, opacity: 1 });
        gsap.set(panel, { opacity: 1, y: 0 });
        return;
      }

      gsap
        .timeline()
        .fromTo(panel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .fromTo(
          circle,
          { strokeDashoffset: 1, opacity: 1 },
          { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
          0.15,
        )
        .fromTo(
          "[data-success-line]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
          0.35,
        );
    },
    sectionRef,
    [state, reducedMotion],
  );

  return (
    <section ref={sectionRef} id="contact" aria-labelledby="contact-title" className="section-space relative">
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Contact"
          marker="08"
          headingId="contact-title"
          title="Let us build something"
          titleAccent="people will remember."
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* ---------------- Invitation and direct links ---------------- */}
          <div ref={threadHeading}>
            <p className="max-w-md text-base leading-relaxed text-bone-soft md:text-lg">
              Whether you run a business, lead a school, are starting a company, or need a website
              for yourself, I would like to hear about it. Tell me what you are building and I will
              reply with a clear recommendation, a timeline, and a price.
            </p>

            <p className="mt-5 text-sm text-silver">{contactDetails.responseTime}</p>

            <ul className="mt-10 border-t border-line">
              {socialLinks.map((link) => (
                <li key={link.label} className="border-b border-line">
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    data-cursor="contact"
                    data-cursor-label={link.label}
                    className="group flex items-center justify-between gap-6 py-5 transition-colors duration-300"
                  >
                    <span className="text-sm text-silver transition-colors group-hover:text-bone">
                      {link.label}
                    </span>
                    <span className="flex items-center gap-3 text-sm text-bone">
                      {link.handle}
                      <ArrowIcon className="text-cobalt-soft group-hover:translate-x-1" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-10 flex items-center gap-2.5 text-sm text-bone-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              {brand.availability}
            </p>
          </div>

          {/* ---------------- Form ---------------- */}
          <div className="relative">
            {state === "success" ? (
              <div
                ref={successRef}
                role="status"
                className="relative flex min-h-[26rem] flex-col items-center justify-center rounded-2xl border border-line px-8 py-16 text-center"
              >
                {/* The Digital Thread completing its circle. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 120"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
                  fill="none"
                >
                  <circle
                    ref={circleRef}
                    cx="60"
                    cy="60"
                    r="56"
                    stroke="#2f5bff"
                    strokeWidth="1"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1}
                    transform="rotate(-90 60 60)"
                  />
                </svg>

                <p data-success-line className="relative eyebrow">
                  Enquiry received
                </p>
                <h3 data-success-line className="relative mt-5 text-2xl text-bone md:text-3xl">
                  Thank you. Your message is on its way.
                </h3>
                <p data-success-line className="relative mt-4 max-w-sm text-sm leading-relaxed text-silver">
                  I read every enquiry personally and reply within one business day. If it is
                  urgent, send a message on WhatsApp and I will answer sooner.
                </p>
                <div data-success-line className="relative mt-8">
                  <Button variant="outline" onClick={() => setState("idle")}>
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5">
                {/* Spam trap, hidden from people and from screen readers. */}
                <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                  <label htmlFor="company_website">Leave this field empty</label>
                  <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Full Name"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    value={values.fullName}
                    error={errors.fullName}
                    onChange={(event) => update("fullName")(event.target.value)}
                  />
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                    value={values.email}
                    error={errors.email}
                    onChange={(event) => update("email")(event.target.value)}
                  />
                </div>

                <TextField
                  label="Business or Brand Name"
                  name="business"
                  autoComplete="organization"
                  placeholder="Optional"
                  hint="Optional"
                  value={values.business}
                  error={errors.business}
                  onChange={(event) => update("business")(event.target.value)}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Project Type"
                    name="projectType"
                    required
                    value={values.projectType}
                    error={errors.projectType}
                    onChange={(event) => update("projectType")(event.target.value)}
                  >
                    <option value="">Select a project type</option>
                    {projectTypeOptions.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    label="Estimated Budget"
                    name="budget"
                    hint="Optional"
                    value={values.budget}
                    error={errors.budget}
                    onChange={(event) => update("budget")(event.target.value)}
                  >
                    <option value="">Select a range</option>
                    {budgetOptions.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <TextAreaField
                  label="Project Details"
                  name="details"
                  required
                  rows={6}
                  placeholder="What are you building, who is it for, and what should it achieve?"
                  value={values.details}
                  error={errors.details}
                  onChange={(event) => update("details")(event.target.value)}
                />

                {state === "error" ? (
                  <p role="alert" className="rounded-xl border border-alert/40 bg-alert/10 px-4 py-3 text-sm text-bone">
                    {failure} You can also email me at {contactDetails.email}.
                  </p>
                ) : null}

                <div ref={threadAction} className="mt-2 flex flex-wrap items-center gap-5">
                  <Button type="submit" size="lg" disabled={state === "sending"} data-cursor="contact">
                    {state === "sending" ? (
                      <>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-3.5 w-3.5 rounded-full border border-white/40 border-t-white",
                            !reducedMotion && "animate-spin",
                          )}
                        />
                        Sending your message
                      </>
                    ) : (
                      <>
                        Send Project Enquiry
                        <ArrowIcon className="group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-silver-dim">
                    Your details are used only to reply to this enquiry.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

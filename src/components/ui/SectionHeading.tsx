import type { ReactNode } from "react";
import { RevealText } from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small label above the title, for example "Selected work". */
  eyebrow: string;
  /** Two digit section marker shown on the far side. */
  marker?: string;
  title: string;
  /** Optional trailing words rendered in the editorial serif. */
  titleAccent?: string;
  /** Supporting sentence, placed beside the title on wide screens. */
  lead?: string;
  className?: string;
  children?: ReactNode;
  headingLevel?: "h2" | "h3";
  /** Id placed on the heading, so a section can label itself with it. */
  headingId?: string;
}

/**
 * The editorial heading used at the top of every section.
 *
 * On wide screens the title and the supporting sentence sit side by side,
 * which keeps the full width of the page in use and gives every section the
 * same recognisable rhythm.
 */
export function SectionHeading({
  eyebrow,
  marker,
  title,
  titleAccent,
  lead,
  className,
  children,
  headingLevel = "h2",
  headingId,
}: SectionHeadingProps) {
  const Heading = headingLevel;

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
        <span className="eyebrow inline-flex items-center gap-3">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-cobalt" />
          {eyebrow}
        </span>
        {marker ? (
          <span aria-hidden="true" className="font-mono text-xs text-silver-dim">
            {marker}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-10 grid gap-8",
          lead && "lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16",
        )}
      >
        <Heading id={headingId} className="display-lg max-w-3xl text-bone">
          <RevealText text={title} />
          {titleAccent ? (
            <>
              {" "}
              <RevealText
                text={titleAccent}
                className="font-editorial italic text-cobalt-soft"
                delay={0.08}
              />
            </>
          ) : null}
        </Heading>

        {lead ? (
          <p className="max-w-xl text-base leading-relaxed text-bone-soft lg:pb-2">{lead}</p>
        ) : null}
      </div>

      {children}
    </div>
  );
}

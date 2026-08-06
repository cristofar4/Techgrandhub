import { brand } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The TechGrandHub mark: a node with a thread running through it, which is
 * the same idea the whole website is built on.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [first, second] = brand.nameParts;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 28 28"
        aria-hidden="true"
        className="h-7 w-7 shrink-0"
        fill="none"
        strokeLinecap="round"
      >
        <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="7" stroke="currentColor" strokeOpacity="0.22" />
        <path d="M5 19.5c4.2 0 4.6-11 9.2-11s4.7 11 8.8 11" stroke="#4d76ff" strokeWidth="1.6" />
        <circle cx="14.2" cy="8.5" r="2.4" fill="#08090b" stroke="#8ea6ff" strokeWidth="1.4" />
      </svg>
      <span
        className={cn(
          "font-medium tracking-[-0.03em]",
          compact ? "text-base" : "text-[1.05rem]",
        )}
      >
        <span className="text-bone">{first}</span>
        <span className="text-cobalt-soft">{second}</span>
      </span>
    </span>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "waiting" | "go" | "result" | "early";

const MESSAGES: Record<Phase, { title: string; note: string }> = {
  idle: { title: "How fast are you?", note: "Press to begin, then wait for cobalt." },
  waiting: { title: "Wait for it", note: "The panel turns cobalt at a random moment." },
  go: { title: "Now", note: "Press as quickly as you can." },
  result: { title: "", note: "Press to try again." },
  early: { title: "Too early", note: "Wait for the colour to change. Press to try again." },
};

/**
 * A reaction timer.
 *
 * One panel, one job. Anything under 250 milliseconds is quick, and the best
 * attempt of the session is kept alongside the latest one.
 */
export function ReactionGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const startedAt = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const arm = useCallback(() => {
    setPhase("waiting");
    const delay = 1200 + Math.random() * 2800;
    timer.current = window.setTimeout(() => {
      startedAt.current = performance.now();
      setPhase("go");
    }, delay);
  }, []);

  const press = useCallback(() => {
    if (phase === "waiting") {
      window.clearTimeout(timer.current);
      setPhase("early");
      return;
    }

    if (phase === "go") {
      const time = Math.round(performance.now() - startedAt.current);
      setElapsed(time);
      setBest((current) => (current === null ? time : Math.min(current, time)));
      setPhase("result");
      return;
    }

    arm();
  }, [arm, phase]);

  const title =
    phase === "result" ? `${elapsed} milliseconds` : MESSAGES[phase].title;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-md items-center justify-between font-mono text-xs text-silver">
        <span>
          Last{" "}
          <span className="text-bone">{phase === "result" ? `${elapsed} ms` : "not yet"}</span>
        </span>
        <span>
          Best <span className="text-cobalt-soft">{best === null ? "not yet" : `${best} ms`}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={press}
        data-cursor="explore"
        data-cursor-label="Press"
        aria-live="polite"
        className={cn(
          "flex aspect-4/3 w-full max-w-md flex-col items-center justify-center gap-3 rounded-2xl border px-6 text-center transition-colors duration-150",
          phase === "go"
            ? "border-cobalt bg-cobalt text-white"
            : phase === "early"
              ? "border-alert/60 bg-alert/12 text-bone"
              : phase === "waiting"
                ? "border-line bg-ink-raised text-silver"
                : "border-line bg-ink-raised text-bone hover:border-line-strong",
        )}
      >
        <span className="text-2xl">{title}</span>
        <span
          className={cn(
            "max-w-[28ch] text-xs leading-relaxed",
            phase === "go" ? "text-white/80" : "text-silver",
          )}
        >
          {MESSAGES[phase].note}
        </span>
      </button>
    </div>
  );
}

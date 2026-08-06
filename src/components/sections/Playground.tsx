import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { THREAD_ORDER, useThreadAnchor } from "@/components/thread/ThreadContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CodeLab } from "@/components/playground/CodeLab";
import { SnakeGame } from "@/components/playground/SnakeGame";
import { MemoryGame } from "@/components/playground/MemoryGame";
import { ReactionGame } from "@/components/playground/ReactionGame";

type Mode = "code" | "play";
type GameId = "snake" | "memory" | "reaction";

const GAMES: Array<{ id: GameId; label: string; note: string }> = [
  { id: "snake", label: "Snake", note: "Steer, grow, do not touch yourself." },
  { id: "memory", label: "Memory", note: "Find all eight pairs in as few moves as you can." },
  { id: "reaction", label: "Reaction", note: "One panel, one press. How fast are you?" },
];

/**
 * Playground.
 *
 * Somewhere for a visitor to stay a little longer. Developers get a real
 * editor with a live preview, and everybody else gets something to play with.
 * All of it runs in the browser, with nothing sent anywhere.
 */
export function Playground() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("code");
  const [game, setGame] = useState<GameId>("snake");
  const threadRef = useThreadAnchor(THREAD_ORDER.playground);

  return (
    <section
      ref={sectionRef}
      id="playground"
      aria-labelledby="playground-title"
      className="section-space relative"
    >
      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="Playground"
          marker="06"
          headingId="playground-title"
          title="Have a go"
          titleAccent="yourself."
          lead="Write some code and watch it run, or leave the code alone and play something. Everything here happens inside your own browser."
        />

        {/* ---------------- Mode switch ---------------- */}
        <div
          ref={threadRef}
          className="mt-12 inline-flex rounded-full border border-line p-1"
          role="group"
          aria-label="Choose what to do"
        >
          {(
            [
              { id: "code", label: "Write code" },
              { id: "play", label: "Play a game" },
            ] as const
          ).map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setMode(entry.id)}
              aria-pressed={mode === entry.id}
              data-cursor="explore"
              className={cn(
                "rounded-full px-5 py-2.5 text-sm transition-colors duration-300",
                mode === entry.id ? "bg-cobalt text-white" : "text-silver hover:text-bone",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {mode === "code" ? (
          <div className="mt-10">
            <CodeLab />
          </div>
        ) : (
          <div className="mt-10">
            {/* ---------------- Game picker ---------------- */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a game">
              {GAMES.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setGame(entry.id)}
                  aria-pressed={game === entry.id}
                  data-cursor="explore"
                  className={cn(
                    "rounded-full border px-4 py-2 text-[0.8rem] transition-colors duration-300",
                    game === entry.id
                      ? "border-cobalt bg-cobalt/12 text-bone"
                      : "border-line text-silver hover:border-line-strong hover:text-bone",
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>

            <p className="mt-5 text-sm text-silver">
              {GAMES.find((entry) => entry.id === game)?.note}
            </p>

            <div className="mt-10 flex justify-center">
              {game === "snake" ? <SnakeGame /> : null}
              {game === "memory" ? <MemoryGame /> : null}
              {game === "reaction" ? <ReactionGame /> : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

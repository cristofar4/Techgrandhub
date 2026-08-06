import { useCallback, useEffect, useRef, useState } from "react";
import { memoryPairs } from "@/data/playground";
import { cn } from "@/lib/utils";

interface Card {
  /** Unique per card, so the two halves of a pair stay separate. */
  key: string;
  label: string;
  matched: boolean;
}

function shuffled(): Card[] {
  const deck = memoryPairs.flatMap((label, index) => [
    { key: `${label}-a-${index}`, label, matched: false },
    { key: `${label}-b-${index}`, label, matched: false },
  ]);

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Match the pairs.
 *
 * Two cards stay face up for a moment when they do not match, which is the
 * whole game. The board is a list of buttons, so it works with a keyboard.
 */
export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(shuffled);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const solved = cards.every((card) => card.matched);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reset = useCallback(() => {
    window.clearTimeout(timer.current);
    setCards(shuffled());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  }, []);

  const choose = (index: number) => {
    if (locked || flipped.includes(index) || cards[index].matched) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length < 2) return;

    setMoves((current) => current + 1);
    const [first, second] = next;

    if (cards[first].label === cards[second].label) {
      setCards((current) =>
        current.map((card, position) =>
          position === first || position === second ? { ...card, matched: true } : card,
        ),
      );
      setFlipped([]);
      return;
    }

    setLocked(true);
    timer.current = window.setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, 750);
  };

  const matchedCount = cards.filter((card) => card.matched).length / 2;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-md items-center justify-between font-mono text-xs text-silver">
        <span>
          Moves <span className="text-bone">{String(moves).padStart(2, "0")}</span>
        </span>
        <span>
          Pairs{" "}
          <span className="text-cobalt-soft">
            {matchedCount} of {memoryPairs.length}
          </span>
        </span>
      </div>

      <ul className="grid w-full max-w-md grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map((card, index) => {
          const showing = card.matched || flipped.includes(index);
          return (
            <li key={card.key}>
              <button
                type="button"
                onClick={() => choose(index)}
                disabled={card.matched}
                data-cursor="explore"
                aria-label={showing ? card.label : "Face down card"}
                className={cn(
                  "flex aspect-square w-full items-center justify-center rounded-xl border px-1 text-center font-mono text-[0.62rem] uppercase tracking-[0.06em] transition-all duration-300 sm:text-[0.7rem]",
                  card.matched
                    ? "border-signal/50 bg-signal/10 text-signal"
                    : showing
                      ? "border-cobalt bg-cobalt/15 text-bone"
                      : "border-line bg-ink-raised text-transparent hover:border-line-strong",
                )}
              >
                {showing ? card.label : "?"}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex min-h-9 items-center gap-4">
        {solved ? (
          <p className="text-sm text-signal">
            Cleared in {moves} moves.
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          data-cursor="explore"
          className="rounded-full border border-line px-4 py-2 text-xs text-bone-soft transition-colors hover:border-cobalt-soft hover:text-bone"
        >
          {solved ? "Play again" : "Shuffle"}
        </button>
      </div>
    </div>
  );
}

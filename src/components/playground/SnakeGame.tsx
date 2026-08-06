import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 17;
const STEP_MS = 130;

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const VECTOR: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Snake, drawn on a canvas.
 *
 * Arrow keys or the letters W, A, S, and D on a keyboard. Swipe on a phone.
 * The whole game is a fixed step loop, so it runs at the same speed whatever
 * the screen refresh rate is.
 */
export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [state, setState] = useState<"ready" | "playing" | "over">("ready");

  // Mutable game state, kept out of React so the loop never re renders.
  const snake = useRef<Point[]>([]);
  const direction = useRef<Direction>("right");
  const queued = useRef<Direction[]>([]);
  const food = useRef<Point>({ x: 5, y: 5 });
  const accumulator = useRef(0);
  const lastTime = useRef(0);
  const frame = useRef(0);
  const running = useRef(false);

  const placeFood = useCallback(() => {
    const taken = new Set(snake.current.map((part) => `${part.x},${part.y}`));
    const free: Point[] = [];
    for (let x = 0; x < GRID; x += 1) {
      for (let y = 0; y < GRID; y += 1) {
        if (!taken.has(`${x},${y}`)) free.push({ x, y });
      }
    }
    if (free.length > 0) {
      food.current = free[Math.floor(Math.random() * free.length)];
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const size = canvas.width / GRID;

    context.fillStyle = "#0e1014";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Board grid, very faint.
    context.strokeStyle = "rgba(244, 241, 235, 0.045)";
    context.lineWidth = 1;
    for (let i = 1; i < GRID; i += 1) {
      context.beginPath();
      context.moveTo(i * size, 0);
      context.lineTo(i * size, canvas.height);
      context.stroke();
      context.beginPath();
      context.moveTo(0, i * size);
      context.lineTo(canvas.width, i * size);
      context.stroke();
    }

    // Food.
    context.fillStyle = "#59d1a6";
    context.beginPath();
    context.arc(
      (food.current.x + 0.5) * size,
      (food.current.y + 0.5) * size,
      size * 0.28,
      0,
      Math.PI * 2,
    );
    context.fill();

    // Snake, brightest at the head.
    snake.current.forEach((part, index) => {
      const fade = 1 - Math.min(index / (snake.current.length + 4), 0.62);
      context.fillStyle = index === 0 ? "#8ea6ff" : `rgba(47, 91, 255, ${fade})`;
      context.fillRect(part.x * size + 1.5, part.y * size + 1.5, size - 3, size - 3);
    });
  }, []);

  const stop = useCallback(() => {
    running.current = false;
    cancelAnimationFrame(frame.current);
  }, []);

  const tick = useCallback(() => {
    const next = queued.current.shift();
    if (next && next !== OPPOSITE[direction.current]) direction.current = next;

    const head = snake.current[0];
    const move = VECTOR[direction.current];
    const target = { x: head.x + move.x, y: head.y + move.y };

    const hitWall =
      target.x < 0 || target.y < 0 || target.x >= GRID || target.y >= GRID;
    const hitSelf = snake.current.some((part) => part.x === target.x && part.y === target.y);

    if (hitWall || hitSelf) {
      stop();
      setState("over");
      setScore((current) => {
        setBest((highest) => Math.max(highest, current));
        return current;
      });
      return;
    }

    snake.current.unshift(target);

    if (target.x === food.current.x && target.y === food.current.y) {
      setScore((current) => current + 1);
      placeFood();
    } else {
      snake.current.pop();
    }
  }, [placeFood, stop]);

  const loop = useCallback(
    (time: number) => {
      if (!running.current) return;
      const delta = time - lastTime.current;
      lastTime.current = time;
      accumulator.current += delta;

      while (accumulator.current >= STEP_MS) {
        accumulator.current -= STEP_MS;
        tick();
        if (!running.current) break;
      }

      draw();
      if (running.current) frame.current = requestAnimationFrame(loop);
    },
    [draw, tick],
  );

  const start = useCallback(() => {
    const middle = Math.floor(GRID / 2);
    snake.current = [
      { x: middle, y: middle },
      { x: middle - 1, y: middle },
      { x: middle - 2, y: middle },
    ];
    direction.current = "right";
    queued.current = [];
    accumulator.current = 0;
    lastTime.current = performance.now();
    placeFood();
    setScore(0);
    setState("playing");
    running.current = true;
    frame.current = requestAnimationFrame(loop);
    // The board listens for the arrow keys, so it needs the focus straight away.
    boardRef.current?.focus();
  }, [loop, placeFood]);

  /* Draw the resting board before the first game. */
  useEffect(() => {
    const middle = Math.floor(GRID / 2);
    snake.current = [
      { x: middle, y: middle },
      { x: middle - 1, y: middle },
      { x: middle - 2, y: middle },
    ];
    draw();
    return stop;
  }, [draw, stop]);

  /* Keyboard, only while the pointer or focus is on the board. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const map: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const next = map[event.key] ?? map[event.key.toLowerCase()];
    if (!next) return;
    event.preventDefault();
    if (state !== "playing") {
      start();
      return;
    }
    if (queued.current.length < 2) queued.current.push(next);
  };

  /* Swipe on touch screens. */
  const touchStart = useRef<Point | null>(null);
  const onTouchStart = (event: React.TouchEvent) => {
    const point = event.touches[0];
    touchStart.current = { x: point.clientX, y: point.clientY };
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const origin = touchStart.current;
    if (!origin) return;
    const point = event.changedTouches[0];
    const dx = point.clientX - origin.x;
    const dy = point.clientY - origin.y;
    touchStart.current = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    const next: Direction =
      Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    if (state !== "playing") {
      start();
      return;
    }
    if (queued.current.length < 2) queued.current.push(next);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-md items-center justify-between font-mono text-xs text-silver">
        <span>
          Score <span className="text-bone">{String(score).padStart(2, "0")}</span>
        </span>
        <span>
          Best <span className="text-cobalt-soft">{String(best).padStart(2, "0")}</span>
        </span>
      </div>

      <div
        ref={boardRef}
        role="application"
        aria-label="Snake game. Use the arrow keys to steer, or swipe on a touch screen."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full max-w-md rounded-2xl border border-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt-soft"
      >
        <canvas
          ref={canvasRef}
          width={510}
          height={510}
          className="block w-full rounded-2xl"
          style={{ aspectRatio: "1 / 1", touchAction: "none" }}
        />

        {state !== "playing" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-ink-deep/78 px-6 text-center backdrop-blur-sm">
            <p className="text-lg text-bone">
              {state === "over" ? `You scored ${score}` : "Collect the green dots"}
            </p>
            <p className="max-w-[24ch] text-xs leading-relaxed text-silver">
              Arrow keys, or the letters W, A, S, and D. On a phone, swipe.
            </p>
            <button
              type="button"
              onClick={start}
              data-cursor="explore"
              className="rounded-full bg-cobalt px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cobalt-bright"
            >
              {state === "over" ? "Play again" : "Start"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

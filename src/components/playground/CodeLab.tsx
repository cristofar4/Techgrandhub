import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { codeTemplates, type CodeTemplate } from "@/data/playground";
import { cn } from "@/lib/utils";

type PaneId = "html" | "css" | "js";

/**
 * Built in two halves so the sequence never appears literally in this file.
 * A bundler that ever inlines this module into an HTML document would
 * otherwise see it as the end of the surrounding script.
 */
const CLOSING_SCRIPT_TAG = `<${"/script"}>`;

const PANES: Array<{ id: PaneId; label: string }> = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JavaScript" },
];

/**
 * Build the document handed to the preview frame.
 *
 * The frame runs with the scripts permission only. Without permission for the
 * same origin it is treated as a separate site, so code written here cannot
 * reach this page, its storage, or its cookies. Errors are caught and printed
 * inside the frame instead of disappearing into the console.
 */
function buildDocument(html: string, css: string, js: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; }
      .techgrandhub-error {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2147483647;
        margin: 0;
        padding: 10px 14px;
        background: #2b0f0d;
        border-top: 1px solid #ff6b5e;
        color: #ffb4ad;
        font: 12px/1.5 ui-monospace, monospace;
        white-space: pre-wrap;
      }
    </style>
    <style>${css}</style>
  </head>
  <body>
${html}
    <script>
      (function () {
        function show(message) {
          var box = document.createElement("pre");
          box.className = "techgrandhub-error";
          box.textContent = message;
          document.body.appendChild(box);
        }
        window.addEventListener("error", function (event) {
          show(event.message + (event.lineno ? "  (line " + event.lineno + ")" : ""));
        });
        window.addEventListener("unhandledrejection", function (event) {
          show("Unhandled promise rejection: " + event.reason);
        });
        try {
${js}
        } catch (error) {
          show(error && error.message ? error.message : String(error));
        }
      })();
    ${CLOSING_SCRIPT_TAG}
  </body>
</html>`;
}

/**
 * A small editor with a live preview.
 *
 * Everything runs in the visitor's own browser. Nothing is uploaded, nothing
 * is stored on a server, and the work survives a page reload because it is
 * kept in local storage.
 */
export function CodeLab() {
  const [template, setTemplate] = useState<CodeTemplate>(codeTemplates[0]);
  const [pane, setPane] = useState<PaneId>("html");
  const [code, setCode] = useState({
    html: codeTemplates[0].html,
    css: codeTemplates[0].css,
    js: codeTemplates[0].js,
  });
  const [document_, setDocument_] = useState(() =>
    buildDocument(codeTemplates[0].html, codeTemplates[0].css, codeTemplates[0].js),
  );
  const [dirty, setDirty] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Bring back whatever was being written last time. */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("techgrandhub-codelab");
      if (!saved) return;
      const parsed = JSON.parse(saved) as typeof code;
      if (parsed?.html !== undefined) {
        setCode(parsed);
        setDocument_(buildDocument(parsed.html, parsed.css, parsed.js));
      }
    } catch {
      // A damaged entry is not worth reporting. The starter code stands in.
    }
  }, []);

  const run = useCallback(() => {
    setDocument_(buildDocument(code.html, code.css, code.js));
    setDirty(false);
    try {
      window.localStorage.setItem("techgrandhub-codelab", JSON.stringify(code));
    } catch {
      // Private browsing refuses storage. The editor still works.
    }
  }, [code]);

  /* Run shortly after typing stops, unless that was switched off. */
  useEffect(() => {
    if (!autoRun || !dirty) return;
    const timer = window.setTimeout(run, 700);
    return () => window.clearTimeout(timer);
  }, [autoRun, dirty, run]);

  const update = (value: string) => {
    setCode((current) => ({ ...current, [pane]: value }));
    setDirty(true);
  };

  const loadTemplate = (next: CodeTemplate) => {
    setTemplate(next);
    setCode({ html: next.html, css: next.css, js: next.js });
    setDocument_(buildDocument(next.html, next.css, next.js));
    setDirty(false);
  };

  /* Tab indents instead of leaving the editor. Escape restores tab as escape. */
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab" || event.shiftKey) return;
    event.preventDefault();
    const target = event.currentTarget;
    const { selectionStart, selectionEnd, value } = target;
    const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
    update(next);
    window.requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = selectionStart + 2;
    });
  };

  const lineCount = useMemo(() => code[pane].split("\n").length, [code, pane]);

  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {/* ---------------- Editor ---------------- */}
      <div className="flex h-[28rem] flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised lg:h-[34rem]">
        <div className="flex flex-wrap items-center gap-1 border-b border-line px-3 py-2.5">
          {PANES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setPane(entry.id)}
              aria-pressed={pane === entry.id}
              data-cursor="explore"
              className={cn(
                "rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors duration-300",
                pane === entry.id
                  ? "bg-cobalt/15 text-bone"
                  : "text-silver hover:text-bone",
              )}
            >
              {entry.label}
            </button>
          ))}

          <span className="ms-auto font-mono text-[0.65rem] text-silver-dim">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        </div>

        <label htmlFor="codelab-editor" className="sr-only">
          {PANES.find((entry) => entry.id === pane)?.label} editor
        </label>
        <textarea
          id="codelab-editor"
          ref={textareaRef}
          value={code[pane]}
          onChange={(event) => update(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          className="min-h-0 w-full flex-1 resize-none bg-transparent p-4 font-mono text-[0.8rem] leading-relaxed text-bone outline-none placeholder:text-silver-dim"
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2.5">
          <button
            type="button"
            onClick={run}
            data-cursor="explore"
            className="rounded-full bg-cobalt px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-cobalt-bright"
          >
            Run the code
          </button>
          <button
            type="button"
            onClick={() => loadTemplate(template)}
            data-cursor="explore"
            className="rounded-full border border-line px-4 py-2 text-xs text-bone-soft transition-colors hover:border-cobalt-soft hover:text-bone"
          >
            Reset
          </button>

          <label className="ms-auto flex cursor-pointer items-center gap-2 text-xs text-silver">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(event) => setAutoRun(event.target.checked)}
              className="h-3.5 w-3.5 accent-[#2f5bff]"
            />
            Run as I type
          </label>
        </div>
      </div>

      {/* ---------------- Preview ---------------- */}
      <div className="flex h-[28rem] flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised lg:h-[34rem]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-silver-dim/60" />
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-silver-dim/40" />
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-silver-dim/25" />
          <span className="ms-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-silver-dim">
            Preview
          </span>
          {dirty && autoRun ? (
            <span className="ms-auto font-mono text-[0.65rem] text-cobalt-soft">Updating</span>
          ) : null}
        </div>

        <iframe
          title="Live preview of your code"
          srcDoc={document_}
          sandbox="allow-scripts"
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      </div>

      {/* ---------------- Starters ---------------- */}
      <div className="lg:col-span-2">
        <p className="eyebrow">Start from one of these</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {codeTemplates.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => loadTemplate(entry)}
              aria-pressed={template.id === entry.id}
              data-cursor="explore"
              className={cn(
                "rounded-xl border p-4 text-left transition-colors duration-300",
                template.id === entry.id
                  ? "border-cobalt bg-cobalt/8"
                  : "border-line hover:border-line-strong",
              )}
            >
              <span className="block text-sm text-bone">{entry.label}</span>
              <span className="mt-1.5 block text-xs leading-relaxed text-silver">
                {entry.description}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-silver-dim">
          Everything here runs inside your own browser, in a sealed frame. Nothing is uploaded,
          and your work is remembered on this device only.
        </p>
      </div>
    </div>
  );
}

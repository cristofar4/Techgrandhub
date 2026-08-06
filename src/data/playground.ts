/** Starter code offered in the playground editor. */

export interface CodeTemplate {
  id: string;
  label: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

export const codeTemplates: CodeTemplate[] = [
  {
    id: "card",
    label: "Profile card",
    description: "Layout, spacing, and a hover state.",
    html: `<div class="card">
  <div class="avatar">TG</div>
  <h2>Ada Nwosu</h2>
  <p>Frontend developer, Lagos</p>
  <button id="follow">Follow</button>
</div>`,
    css: `body {
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
  background: #0e1014;
  font-family: system-ui, sans-serif;
  color: #f4f1eb;
}

.card {
  width: 260px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid rgba(244, 241, 235, 0.12);
  border-radius: 20px;
  background: #141821;
  transition: transform 0.3s, border-color 0.3s;
}

.card:hover {
  transform: translateY(-6px);
  border-color: #2f5bff;
}

.avatar {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #2f5bff;
  font-weight: 600;
}

h2 { margin: 0 0 6px; font-size: 20px; }
p { margin: 0 0 22px; color: #949cab; font-size: 14px; }

button {
  padding: 10px 24px;
  border: 0;
  border-radius: 999px;
  background: #2f5bff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}`,
    js: `const button = document.getElementById("follow");
let following = false;

button.addEventListener("click", () => {
  following = !following;
  button.textContent = following ? "Following" : "Follow";
  button.style.background = following ? "#59d1a6" : "#2f5bff";
});`,
  },
  {
    id: "grid",
    label: "Responsive grid",
    description: "A layout that reflows on its own.",
    html: `<main>
  <h1>Our services</h1>
  <div class="grid">
    <article><h3>Websites</h3><p>Built to be found and trusted.</p></article>
    <article><h3>Landing pages</h3><p>One message, one action.</p></article>
    <article><h3>Redesign</h3><p>New life for an old website.</p></article>
    <article><h3>Frontend</h3><p>Designs turned into interfaces.</p></article>
  </div>
</main>`,
    css: `body {
  margin: 0;
  padding: 40px 24px;
  background: #0e1014;
  color: #f4f1eb;
  font-family: system-ui, sans-serif;
}

h1 { font-size: 28px; margin: 0 0 28px; }

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

article {
  padding: 22px;
  border: 1px solid rgba(244, 241, 235, 0.12);
  border-radius: 16px;
  background: #141821;
}

h3 { margin: 0 0 8px; font-size: 16px; color: #8ea6ff; }
p { margin: 0; font-size: 14px; color: #949cab; line-height: 1.6; }`,
    js: `// Resize the preview panel and watch the columns rearrange themselves.
console.log("Columns fit themselves to the space available.");`,
  },
  {
    id: "counter",
    label: "Counter",
    description: "State, events, and updating the page.",
    html: `<div class="counter">
  <button id="down" aria-label="Decrease">&minus;</button>
  <span id="value">0</span>
  <button id="up" aria-label="Increase">+</button>
</div>
<p id="note">Try holding a button down.</p>`,
    css: `body {
  display: grid;
  place-content: center;
  min-height: 100vh;
  margin: 0;
  gap: 20px;
  background: #0e1014;
  color: #f4f1eb;
  font-family: system-ui, sans-serif;
  text-align: center;
}

.counter {
  display: flex;
  align-items: center;
  gap: 22px;
}

button {
  width: 52px;
  height: 52px;
  border: 1px solid rgba(244, 241, 235, 0.2);
  border-radius: 50%;
  background: transparent;
  color: #f4f1eb;
  font-size: 22px;
  cursor: pointer;
}

button:hover { border-color: #2f5bff; }

#value {
  min-width: 90px;
  font-size: 52px;
  font-variant-numeric: tabular-nums;
}

#note { margin: 0; color: #949cab; font-size: 13px; }`,
    js: `let count = 0;
const value = document.getElementById("value");

function render() {
  value.textContent = count;
  value.style.color = count > 0 ? "#59d1a6" : count < 0 ? "#ff6b5e" : "#f4f1eb";
}

function step(by) {
  count += by;
  render();
}

for (const [id, by] of [["up", 1], ["down", -1]]) {
  const button = document.getElementById(id);
  let timer;
  button.addEventListener("click", () => step(by));
  button.addEventListener("pointerdown", () => {
    timer = setInterval(() => step(by), 120);
  });
  for (const event of ["pointerup", "pointerleave"]) {
    button.addEventListener(event, () => clearInterval(timer));
  }
}

render();`,
  },
];

/** Pairs used by the memory game. */
export const memoryPairs: string[] = [
  "HTML",
  "CSS",
  "JS",
  "React",
  "GSAP",
  "Git",
  "Tailwind",
  "Node",
];

import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import orb from "@/assets/orb.jpg";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import project4 from "@/assets/project4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: "https://id-preview--ed1f9352-9a1e-4c87-ab64-3c7fa124d0f4.lovable.app/favicon.ico" },
    ],
  }),
  component: Portfolio,
});

/* ---------- shared primitives ---------- */

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SplitHeading({ text, className = "", as: As = "h2", delay = 0, mount = false }: { text: string; className?: string; as?: React.ElementType; delay?: number; mount?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const trigger = mount || inView;
  const words = text.split(" ");
  return (
    <As ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-[0.08em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={trigger ? { y: "0%" } : undefined}
            transition={{ duration: 0.9, ease, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </As>
  );
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-mono">
      <span className="text-gold">{n}</span>
      <span className="h-px w-8 bg-white/20" />
      <span>{label}</span>
    </div>
  );
}

/* ---------- cursor ---------- */

function Cursor() {
  const x = useSpring(0, { stiffness: 400, damping: 30, mass: 0.4 });
  const y = useSpring(0, { stiffness: 400, damping: 30, mass: 0.4 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a,button,[data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x, y }}
    >
      <motion.div
        animate={{ scale: hover ? 2.4 : 1, opacity: hover ? 0.5 : 1 }}
        transition={{ duration: 0.3, ease }}
        className="-translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-gold mix-blend-difference"
      />
    </motion.div>
  );
}

/* ---------- nav ---------- */

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className={`mx-auto mt-4 flex max-w-[1400px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 md:px-8 ${scrolled ? "glass mx-4" : "mx-4 bg-transparent"}`}>
        <a href="#top" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_20px_theme(colors.amber.300)]" />
          <span>Praise<span className="text-gold">.</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="group relative rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-gold/60 transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110">
          Start a project <span aria-hidden>→</span>
        </a>
        <button className="md:hidden rounded-full glass px-3 py-2 text-sm" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="mx-4 mt-2 rounded-3xl glass p-4 md:hidden"
          >
            <div className="flex flex-col">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-lg font-display">{n.label}</a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="mt-3 rounded-full bg-gold px-4 py-3 text-center text-primary-foreground">Start a project</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---------- hero ---------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden pt-32 md:pt-36">
      {/* orb backdrop */}
      <motion.img
        src={orb} alt="" aria-hidden
        style={{ y: y2, scale }}
        className="pointer-events-none absolute -right-40 -top-40 h-[70vh] w-[70vh] rounded-full opacity-60 blur-2xl md:opacity-80"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-10">
        <motion.div style={{ y: y1, opacity }} className="md:col-span-7 md:pt-6">
          <Reveal>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-muted-foreground font-mono">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for Q2 · Booking worldwide
            </div>
          </Reveal>

          <h1 className="mt-8 font-display text-[13vw] leading-[0.92] tracking-tight md:text-[7.2vw]">
            <SplitHeading as="span" mount text="Crafting" className="block" delay={0.2} />
            <SplitHeading as="span" mount text="exceptional" className="block text-gradient-gold italic" delay={0.35} />
            <SplitHeading as="span" mount text="digital" className="block" delay={0.5} />
            <span className="inline-flex items-baseline gap-4">
              <SplitHeading as="span" mount text="experiences." className="inline-block" delay={0.65} />
              <motion.span
                initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease }}
                className="hidden md:inline-block h-4 w-4 rounded-full bg-gold shadow-[0_0_40px_10px_oklch(0.85_0.13_85/0.5)]"
              />
            </span>
          </h1>

          <Reveal delay={0.6}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              I'm <span className="text-foreground">Praise Christopher</span> — a frontend developer building
              luxury websites, landing pages and interactive product experiences for ambitious brands.
              Every pixel intentional. Every interaction memorable.
            </p>
          </Reveal>

          <Reveal delay={0.8}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#contact" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-6 py-4 text-sm font-medium text-primary-foreground transition">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                <span className="relative">Start a project</span>
                <span className="relative">→</span>
              </a>
              <a href="#work" className="inline-flex items-center gap-3 rounded-full glass px-6 py-4 text-sm font-medium">
                <span>See selected work</span>
                <span className="text-muted-foreground">·  09</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-14 grid max-w-lg grid-cols-3 gap-6">
              {[
                { k: "60+", v: "Sites shipped" },
                { k: "5.0★", v: "Client rating" },
                { k: "12", v: "Countries served" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-3xl text-gradient-gold md:text-4xl">{s.k}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>

        {/* portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.4 }}
          className="relative md:col-span-5"
        >
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-gold/30 via-plum/20 to-mist/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] glass p-2 animate-float-slow">
              <img
                src={portrait} alt="Praise Christopher"
                width={912} height={1200}
                className="h-full w-full rounded-[1.8rem] object-cover"
              />
              <div className="pointer-events-none absolute inset-2 rounded-[1.8rem] ring-1 ring-inset ring-white/10" />
              <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded-b-[1.8rem] bg-gradient-to-t from-background/90 via-background/40 to-transparent p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Founder · Frontend</div>
                    <div className="font-display text-2xl">Praise Christopher</div>
                  </div>
                  <div className="rounded-full glass px-3 py-1 text-[10px] font-mono uppercase tracking-widest">v.2026</div>
                </div>
              </div>
            </div>

            {/* floating chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, ease }}
              className="absolute -left-6 top-16 rounded-2xl glass px-4 py-3 text-xs font-mono md:-left-10"
            >
              <div className="text-muted-foreground">Lighthouse</div>
              <div className="mt-1 font-display text-xl text-gradient-gold">99 / 100</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8, ease }}
              className="absolute -right-4 bottom-24 rounded-2xl glass px-4 py-3 text-xs md:-right-10"
            >
              <div className="flex items-center gap-2 font-mono text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live · Building
              </div>
              <div className="mt-1 font-display text-lg">React · TS · GSAP</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-mono"
      >
        Scroll to explore ↓
      </motion.div>
    </section>
  );
}

/* ---------- marquee ---------- */

function Marquee() {
  const items = [
    "Award-winning frontends",
    "Luxury brand websites",
    "SaaS landing pages",
    "3D & motion experiences",
    "Design systems",
    "Conversion-first UX",
    "Headless CMS builds",
    "Interactive storytelling",
  ];
  const row = [...items, ...items];
  return (
    <div className="relative border-y border-white/5 py-8 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee gap-16 font-display text-4xl md:text-6xl">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-16 text-muted-foreground/70">
            {t}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- about ---------- */

function About() {
  return (
    <section id="about" className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
          <SectionLabel n="01" label="About" />
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
              A studio<br />of<span className="italic text-gradient-gold"> one.</span>
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
          <Reveal>
            <p>
              I started building for the web the way most designers start — obsessed with detail,
              impatient with mediocrity. Ten years later, I still believe a website should feel like
              stepping into a well-designed room.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              My philosophy is simple: <span className="text-foreground">clarity, craft, calm.</span>
              Clarity in message. Craft in every micro-interaction. Calm in the way a page breathes.
              I partner with founders, agencies and marketing teams who care about the difference
              between <em className="text-foreground">good enough</em> and <em className="text-foreground">unforgettable</em>.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2 pt-4">
              {["React", "Next.js", "TypeScript", "GSAP", "Framer Motion", "Three.js", "Tailwind", "Shadcn", "Lenis", "R3F"].map((s) => (
                <span key={s} className="rounded-full glass px-4 py-2 text-sm text-foreground/80">{s}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- services ---------- */

const SERVICES = [
  { title: "Business Websites", d: "Modern, conversion-first websites that turn traffic into revenue.", icon: "◈" },
  { title: "Corporate Websites", d: "Refined presence for teams that need to look institutional and modern.", icon: "◉" },
  { title: "Landing Pages", d: "High-performing single pages engineered for campaigns and launches.", icon: "▲" },
  { title: "Portfolio Websites", d: "Editorial storytelling that positions creatives as premium.", icon: "✦" },
  { title: "Website Redesign", d: "Rebuild the front of house without touching what's working underneath.", icon: "↻" },
  { title: "Interactive Websites", d: "3D, scroll storytelling, motion — sites that feel like software.", icon: "◐" },
  { title: "Healthcare Websites", d: "Trust-first design for clinics, wellness brands and health platforms.", icon: "+" },
  { title: "Hotel Websites", d: "Cinematic hospitality experiences that make you want to book.", icon: "◍" },
  { title: "Construction Websites", d: "Bold, structural sites for architects, builders and developers.", icon: "◨" },
];

function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel n="02" label="Services" />
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
              Nine ways I<br /><span className="italic text-gradient-gold">ship</span> for you.
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <p className="max-w-md text-muted-foreground">
            Every engagement is scoped, priced and delivered like a product launch — not a freelancer gig.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease }}
              className="group relative overflow-hidden rounded-3xl glass p-8 h-full"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(400px 300px at var(--mx,50%) var(--my,50%), oklch(0.85 0.13 85 / 0.15), transparent 60%)" }} />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-gradient-gold">{s.icon}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-10 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                <div className="mt-8 flex items-center gap-2 text-sm text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
                  Enquire <span aria-hidden>→</span>
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- portfolio ---------- */

const PROJECTS = [
  { title: "Noldor · Luxury SaaS", tag: "SaaS · Landing", year: "2025", img: project1, meta: "6-figure launch · +212% signups" },
  { title: "Château Hotel", tag: "Hospitality", year: "2025", img: project2, meta: "Cinematic booking flow" },
  { title: "Exquice Health", tag: "Healthcare", year: "2024", img: project3, meta: "HIPAA-conscious IA" },
  { title: "Litonok Studio", tag: "Architecture", year: "2024", img: project4, meta: "Editorial construction firm" },
];

function Portfolio_() {
  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel n="03" label="Selected Work" />
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
                Recent<br />
                <span className="italic text-gradient-gold">stories</span> shipped.
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <a href="#contact" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              Request full case studies <span aria-hidden>↗</span>
            </a>
          </Reveal>
        </div>

        <div className="mt-16 space-y-24 md:space-y-32">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} p={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, idx }: { p: (typeof PROJECTS)[number]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rev = idx % 2 === 1;
  return (
    <div ref={ref} className={`grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12`}>
      <motion.div style={{ y }} className={`md:col-span-8 ${rev ? "md:col-start-5" : ""}`}>
        <Reveal>
          <div className="group relative overflow-hidden rounded-3xl glass p-2">
            <div className="relative overflow-hidden rounded-[1.4rem]">
              <motion.img
                src={p.img} alt={p.title} loading="lazy" width={1400} height={900}
                whileHover={{ scale: 1.06 }} transition={{ duration: 1.2, ease }}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] font-mono uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Case study
              </div>
            </div>
          </div>
        </Reveal>
      </motion.div>
      <div className={`md:col-span-4 ${rev ? "md:col-start-1 md:row-start-1" : ""}`}>
        <Reveal delay={0.1}>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>0{idx + 1}</span><span className="h-px w-6 bg-white/20" /><span>{p.year}</span>
          </div>
          <h3 className="mt-4 font-display text-3xl md:text-4xl">{p.title}</h3>
          <div className="mt-2 text-sm text-gold">{p.tag}</div>
          <p className="mt-4 text-sm text-muted-foreground">{p.meta}</p>
          <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm">
            View case study <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------- process ---------- */

const STEPS = [
  { t: "Discovery", d: "Deep-dive into goals, brand, audience and constraints." },
  { t: "Planning", d: "Sitemap, content strategy, tech decisions, timeline." },
  { t: "UI Design", d: "Art-directed screens designed to feel inevitable." },
  { t: "Development", d: "Pixel-perfect frontend built with modern React + motion." },
  { t: "Testing", d: "Performance, accessibility, cross-device QA." },
  { t: "Launch", d: "Coordinated go-live with monitoring in place." },
  { t: "Support", d: "Ongoing partnership — iterate, measure, improve." },
];

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 40%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  return (
    <section id="process" className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="max-w-2xl">
        <SectionLabel n="04" label="Process" />
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
            Seven steps.<br />
            <span className="italic text-gradient-gold">Zero</span> surprises.
          </h2>
        </Reveal>
      </div>
      <div ref={ref} className="relative mt-20 pl-8 md:pl-24">
        <div className="absolute left-3 top-0 h-full w-px bg-white/10 md:left-10" />
        <motion.div style={{ scaleY, transformOrigin: "top" }} className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-gold via-plum to-mist md:left-10" />
        <div className="space-y-14">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.05}>
              <div className="relative grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
                <div className="absolute -left-[26px] top-2 flex h-4 w-4 items-center justify-center md:-left-[62px]">
                  <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_16px_4px_oklch(0.85_0.13_85/0.5)]" />
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-2">Step 0{i + 1}</div>
                <h3 className="font-display text-3xl md:col-span-4 md:text-4xl">{s.t}</h3>
                <p className="text-muted-foreground md:col-span-6">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- why me ---------- */

const WHY = [
  { t: "Modern UI/UX", d: "Design language that ages well and reads premium." },
  { t: "Responsive Development", d: "Flawless from 320px to 4K, tested on real devices." },
  { t: "Fast Performance", d: "Sub-second loads. Lighthouse 95+ as standard." },
  { t: "SEO Ready", d: "Semantic HTML, structured data, meta done right." },
  { t: "Clean Code", d: "Typed, componentised, easy for future teams to extend." },
  { t: "Premium Animations", d: "Motion with intent — never decoration for its own sake." },
  { t: "Reliable Communication", d: "Weekly demos, transparent boards, no ghosting." },
];

function Why() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionLabel n="05" label="Why Clients Choose Me" />
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-6xl">
              The <span className="italic text-gradient-gold">difference</span> is in the details.
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-7">
          <div className="divide-y divide-white/5 rounded-3xl glass">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 0.05}>
                <div className="group flex items-center gap-6 px-6 py-6 md:px-8 md:py-7">
                  <div className="font-mono text-xs text-muted-foreground w-8">0{i + 1}</div>
                  <div className="flex-1">
                    <div className="font-display text-2xl">{w.t}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{w.d}</div>
                  </div>
                  <span className="text-gold opacity-0 transition group-hover:opacity-100">→</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- testimonials ---------- */

const TESTIS = [
  { q: "Praise delivered the most polished website my company has ever had. Every interaction feels considered.", a: "M. Adeyemi", r: "Founder, Noldor" },
  { q: "The kind of frontend developer you thought only worked at top agencies. Communication was elite.", a: "S. Bello", r: "CMO, Château" },
  { q: "Our conversion rate doubled in the first month. The site simply feels expensive — in the best way.", a: "R. Okafor", r: "Director, Exquice" },
  { q: "Delivered on time, on brief, and 10× more beautiful than the reference. I've hired him twice.", a: "T. Nnamdi", r: "Principal, Litonok" },
];

function Testimonials() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel n="06" label="Testimonials" />
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
              Words from<br /><span className="italic text-gradient-gold">clients.</span>
            </h2>
          </Reveal>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {TESTIS.map((t, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <motion.figure whileHover={{ y: -4 }} className="relative flex h-full flex-col justify-between rounded-3xl glass p-8 md:p-10">
              <div className="absolute -top-6 left-8 font-display text-8xl text-gold/40">"</div>
              <blockquote className="relative font-display text-2xl leading-snug md:text-3xl">{t.q}</blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full glass">
                  <div className="flex h-full w-full items-center justify-center font-display text-lg text-gold">
                    {t.a.split(" ").map((x) => x[0]).join("")}
                  </div>
                </div>
                <div>
                  <div className="text-sm">{t.a}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
                <div className="ml-auto flex h-12 w-16 items-center justify-center rounded-xl border border-white/10 text-xs text-muted-foreground">
                  ▶ Video
                </div>
              </figcaption>
            </motion.figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- pricing ---------- */

const PLANS = [
  { name: "Starter", price: "$1.2k", note: "Landing page", perks: ["1 page, up to 6 sections", "Mobile-first responsive", "Basic on-page SEO", "2 rounds of revisions", "7-day delivery"] },
  { name: "Business", price: "$3.5k", note: "Business website", perks: ["Up to 6 pages", "Custom design system", "Blog / CMS ready", "Contact + email capture", "Advanced SEO"], featured: true },
  { name: "Professional", price: "$6.8k", note: "Interactive site", perks: ["Up to 10 pages", "GSAP + Framer Motion", "Three.js hero / accents", "Analytics + tracking", "Priority support"] },
  { name: "Enterprise", price: "Let's talk", note: "Custom scope", perks: ["Unlimited pages", "Design system + Storybook", "Team workflows", "Ongoing retainer", "Dedicated Slack"] },
];

function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel n="07" label="Pricing" />
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
              Investment<br /><span className="italic text-gradient-gold">tiers.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal><p className="max-w-md text-muted-foreground">Transparent starting points. Every project is quoted precisely after the discovery call.</p></Reveal>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.05}>
            <div className={`relative flex h-full flex-col rounded-3xl p-8 ${p.featured ? "glow-gold bg-gradient-to-b from-gold/10 to-transparent" : "glass"}`}>
              {p.featured && <div className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-primary-foreground">Most picked</div>}
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.note}</div>
              <div className="mt-2 font-display text-3xl">{p.name}</div>
              <div className="mt-6 font-display text-5xl text-gradient-gold">{p.price}</div>
              <ul className="mt-8 space-y-3 text-sm">
                {p.perks.map((k) => (
                  <li key={k} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1 text-gold">✦</span><span>{k}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm ${p.featured ? "bg-gold text-primary-foreground" : "glass"}`}>
                Choose {p.name} →
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQS = [
  { q: "What's your typical timeline?", a: "Landing pages: 1–2 weeks. Business websites: 3–5 weeks. Interactive builds: 6–10 weeks. You'll get a detailed calendar after discovery." },
  { q: "Do you work with clients outside Nigeria?", a: "Yes — most of my work is with brands in the US, UK, EU and UAE. I run projects in your timezone and communicate weekly." },
  { q: "Do you handle design, or only development?", a: "Both. I art-direct and design in Figma, then build in React. If you already have a designer, I'll partner with them." },
  { q: "Can you redesign my existing website?", a: "Absolutely. A large portion of my work is rescuing sites that look outdated or convert poorly." },
  { q: "What tech stack do you use?", a: "React / Next.js, TypeScript, Tailwind, GSAP, Framer Motion, Three.js / R3F, Shadcn UI, Lenis. Modern and future-proof." },
  { q: "Do you offer ongoing support?", a: "Yes — every project ends with an optional care plan for updates, monitoring, and small iterations." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionLabel n="08" label="Frequently Asked" />
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-6xl">
              Answers,<br /><span className="italic text-gradient-gold">upfront.</span>
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          <div className="rounded-3xl glass divide-y divide-white/5">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-8"
                  >
                    <span className="font-display text-xl md:text-2xl">{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-2xl text-gold">+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-muted-foreground md:px-8">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-plum/30 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionLabel n="09" label="Contact" />
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-6xl leading-[0.9] md:text-[8rem]">
                Let's<br /><span className="italic text-gradient-gold">build.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-lg text-muted-foreground">
                Have a project in mind, or an idea you can't stop thinking about?
                I'd love to hear it. Replies within 24 hours.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 space-y-4">
                <a href="mailto:christopherpraise864@gmail.com" className="group flex items-center gap-4 rounded-2xl glass p-5 transition hover:border-gold/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-xl text-gold">✉</div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                    <div className="font-display text-lg">christopherpraise864@gmail.com</div>
                  </div>
                  <span className="text-gold opacity-0 transition group-hover:opacity-100">→</span>
                </a>
                <a href="https://wa.me/2349036961268" target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl glass p-5 transition hover:border-gold/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-400">◉</div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp / Phone</div>
                    <div className="font-display text-lg">0903 696 1268</div>
                  </div>
                  <span className="text-gold opacity-0 transition group-hover:opacity-100">→</span>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6">
            <Reveal delay={0.15}>
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="rounded-3xl glass p-8 md:p-10"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Your name" name="name" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="Company" name="company" className="md:col-span-2" />
                  <Field label="Budget" name="budget" placeholder="e.g. $3–7k" className="md:col-span-2" />
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground">Project</label>
                    <textarea rows={4} required className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold/50 focus:outline-none" placeholder="Tell me a little about what you're building…" />
                  </div>
                </div>
                <button type="submit" className="group relative mt-8 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gold px-6 py-4 font-medium text-primary-foreground">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <span className="relative">{sent ? "Sent — I'll be in touch ✦" : "Send the brief"}</span>
                  <span className="relative">→</span>
                </button>
                <p className="mt-4 text-center text-xs text-muted-foreground">Or press ⌘K to email me directly.</p>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder, className = "" }: { label: string; name: string; type?: string; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input id={name} name={name} type={type} required placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold/50 focus:outline-none" />
    </div>
  );
}

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <div className="font-display text-3xl">Praise<span className="text-gold">.</span></div>
          <div className="mt-1 text-sm text-muted-foreground">Frontend developer · Lagos ↔ Everywhere</div>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} className="hover:text-foreground">{n.label}</a>)}
        </div>
        <div className="text-xs text-muted-foreground font-mono">© {new Date().getFullYear()} · Crafted with intent.</div>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */

function Portfolio() {
  // progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div className="relative min-h-screen">
      <motion.div style={{ scaleX, transformOrigin: "left" }} className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-gold via-plum to-mist" />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Portfolio_ />
        <Process />
        <Why />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

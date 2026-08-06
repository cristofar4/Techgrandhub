import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { ThreadProvider } from "@/components/thread/ThreadContext";
import { DigitalThread } from "@/components/thread/DigitalThread";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { Technologies } from "@/components/sections/Technologies";
import { Playground } from "@/components/sections/Playground";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function App() {
  const [ready, setReady] = useState(false);

  const handleIntroComplete = useCallback(() => setReady(true), []);

  /**
   * Scroll positions are measured from the rendered page, so they have to be
   * recalculated once fonts and photographs have finished arriving.
   */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.fonts?.status !== "loaded") {
      document.fonts?.ready.then(refresh).catch(() => undefined);
    }

    window.addEventListener("load", refresh);
    const timer = window.setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <ThreadProvider>
      <a href="#main" className="skip-link glass-soft rounded-full px-5 py-2.5 text-sm text-bone">
        Skip to the main content
      </a>

      <Preloader onComplete={handleIntroComplete} />
      <CustomCursor />
      <Navbar />

      {/* The page is positioned so the thread can be drawn behind every section. */}
      <div className="relative">
        <DigitalThread />

        <main id="main" className="relative z-10">
          <Hero ready={ready} />
          <About />
          <Services />
          <Projects />
          <Process />
          <Technologies />
          <Playground />
          <Testimonials />
          <Contact />
        </main>

        <Footer />
      </div>
    </ThreadProvider>
  );
}

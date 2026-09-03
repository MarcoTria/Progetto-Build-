import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TransformationsSection } from "./components/TransformationsSection";
import { ProjectGrid } from "./components/ProjectGrid";
import { ProcessSection } from "./components/ProcessSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-gold-bright focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <TransformationsSection />
        <ProjectGrid />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

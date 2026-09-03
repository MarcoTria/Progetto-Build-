import { useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Intro } from "./components/Intro";
import { CinematicJourney } from "./components/cinematic/CinematicJourney";
import { EditorialInterlude } from "./components/EditorialInterlude";
import { CINEMATIC_PROJECTS } from "./data/cinematic";
import { ServicesSection } from "./components/ServicesSection";
import { ProcessSection } from "./components/ProcessSection";
import { SelectedProjects } from "./components/SelectedProjects";
import { BrandStatement } from "./components/BrandStatement";
import { LeadCaptureSection } from "./components/LeadCaptureSection";
import { AIProjectAssistant } from "./components/AIProjectAssistant";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [journey01, journey02, journey03] = CINEMATIC_PROJECTS;

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Intro />

        <div id="journeys">
          <CinematicJourney project={journey01} index={0} />
          <EditorialInterlude
            eyebrow="Progetto Build"
            lines={["Design the vision.", "Build the reality."]}
          />
          <CinematicJourney project={journey02} index={1} />
          <CinematicJourney project={journey03} index={2} />
        </div>

        <ServicesSection />
        <ProcessSection />
        <SelectedProjects />
        <BrandStatement />
        <LeadCaptureSection />
        <FinalCTA />
      </main>
      <Footer />
      <AIProjectAssistant />
    </>
  );
}

import LandingTopNav from "@/components/layout/LandingTopNav";
import FooterStatus from "@/components/layout/FooterStatus";
import HeroColumn from "@/components/landing/HeroColumn";
import InvestigationForm from "@/components/landing/InvestigationForm";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import NetworkMapAnchor from "@/components/landing/NetworkMapAnchor";

export default function HomePage() {
  return (
    <>
      <LandingTopNav />

      {/* Main content */}
      <main className="pt-24 pb-20 px-6 min-h-screen grid-pattern">
        {/* Hero + Form */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <HeroColumn />
          <InvestigationForm />
        </div>

        {/* Architecture section */}
        <ArchitectureSection />

        {/* Map anchor */}
        <NetworkMapAnchor />
      </main>

      <FooterStatus />
    </>
  );
}

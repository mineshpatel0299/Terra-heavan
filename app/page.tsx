import CTASection from "./components/CTASection";
import ContactSection from "./components/ContactSection";
import FeaturesSection from "./components/FeaturesSection";
import FloorPlansSection from "./components/FloorPlansSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import StatsBar from "./components/StatsBar";
import GlobalEffects from "./components/GlobalEffects";

export default function Home() {
  return (
    <>
      <GlobalEffects />
      <Navbar />
      <main className="relative z-0">
        <HeroSection />
        <FeaturesSection />
        <StatsBar />
        <FloorPlansSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

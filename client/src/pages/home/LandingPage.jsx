import Navbar from "../../components/common/Navbar";
import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import ServicesSection from "../../components/home/ServicesSection";
import HowItWorks from "../../components/home/HowItWorks";
import FeaturesSection from "../../components/home/FeaturesSection";
import GreenCorridorSection from "../../components/home/GreenCorridorSection";
import FAQSection from "../../components/home/FAQSection";
import ContactSection from "../../components/home/ContactSection";
import Footer from "../../components/home/Footer";
function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <HowItWorks />
      <FeaturesSection />
      <GreenCorridorSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  );
}

export default LandingPage;
import { Header } from "@/components/header";
import { CTASection } from "@/modules/cta-section";
import { FeaturesSection } from "@/modules/features-section";
import { HeroSection } from "@/modules/hero-section";
import { HowItWorksSection } from "@/modules/how-it-works-section";
import { PricingSection } from "@/modules/pricing-section";
import { TemplatesSection } from "@/modules/templates-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TemplatesSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}

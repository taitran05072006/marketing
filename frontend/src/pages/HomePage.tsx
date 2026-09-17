import { HeroSection } from '../components/home/HeroSection';
import { SkinConcernsSection } from '../components/home/SkinConcernsSection';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { WhyUsSection } from '../components/home/WhyUsSection';
import { KnowledgeSection } from '../components/home/KnowledgeSection';
import { CTABannerSection } from '../components/home/CTABannerSection';

export function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SkinConcernsSection />
      <FeaturedProductsSection />
      <WhyUsSection />
      <KnowledgeSection />
      <CTABannerSection />
    </div>
  );
}

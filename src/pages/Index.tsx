
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { HowItWorks } from '@/components/home/how-it-works';
import { StatsSection } from '@/components/home/stats-section';
import { Testimonials } from '@/components/home/testimonials';
import { CTASection } from '@/components/home/cta-section';
import { useEffect } from 'react';

const Index = () => {
  // Log when the component mounts to help with debugging
  useEffect(() => {
    console.log('Index page mounted successfully');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <StatsSection />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

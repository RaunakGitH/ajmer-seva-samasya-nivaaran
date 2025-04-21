
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to report an issue in your area?
                </h2>
                <p className="text-white/90 text-lg mb-6">
                  Help make Ajmer a better place by reporting civic issues. Your voice matters, and together we can create positive change.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                    <Link to="/submit-complaint" className="flex items-center">
                      Report Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Link to="/how-it-works">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div 
              className="md:w-1/2 bg-cover bg-center min-h-[300px]" 
              style={{ 
                backgroundImage: 'url("https://source.unsplash.com/random/800x600/?city,workers,repair")'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

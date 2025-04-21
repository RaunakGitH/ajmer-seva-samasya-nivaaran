
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/40 to-indigo-100 relative">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
          <div className="md:w-1/2 p-10 flex items-center z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3 drop-shadow">
                Ready to report an issue in your area?
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Help make Ajmer a better place by reporting civic issues. Your voice matters, and together we can create positive change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white hover:scale-105 duration-150 font-bold px-8 py-6 text-lg shadow-lg">
                  <Link to="/submit-complaint" className="flex items-center">
                    Report Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary/10 font-bold px-8 py-6 text-lg">
                  <Link to="/how-it-works">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 min-h-[300px] bg-cover bg-center relative">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80"
              alt="Civic worker"
              className="w-full h-full object-cover min-h-[300px] brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/70 to-transparent md:block hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

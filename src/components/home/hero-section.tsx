
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary/90 to-primary/70 text-white">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://source.unsplash.com/random/1920x1080/?ajmer,india,city")', 
          opacity: 0.3 
        }}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            आपकी आवाज़, हमारा प्रयास
            <span className="block text-2xl md:text-3xl mt-2 font-normal">
              Report & Track Civic Issues in Ajmer
            </span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
            Submit complaints about roads, garbage, water, electricity, and other civic issues. Track their status in real-time and help make Ajmer a better place to live.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/submit-complaint">
                Report an Issue
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/complaints">
                Track My Complaints
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

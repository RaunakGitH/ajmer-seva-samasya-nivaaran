
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-r from-primary/90 to-primary/60 text-white">
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1600&q=80"
          alt="Ajmer City"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto px-4 py-24 flex flex-col items-center text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          आपकी आवाज़, हमारा प्रयास
        </h1>
        <p className="text-2xl md:text-3xl text-white/80 mb-8 font-medium drop-shadow-md">
          Report &amp; Track Civic Issues in Ajmer
        </p>
        <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
          Submit complaints about roads, garbage, water, electricity, and more. Track their status in real-time and help make Ajmer a better place to live.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 hover:scale-105 duration-150 px-8 py-6 font-bold shadow-xl border-2 border-white text-lg">
            <Link to="/submit-complaint">
              Report an Issue
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-8 py-6 font-bold shadow-xl text-lg">
            <Link to="/complaints">
              Track My Complaints
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

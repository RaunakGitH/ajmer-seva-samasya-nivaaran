
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "I reported a pothole on my street, and it was fixed within 3 days. The tracking system kept me informed throughout the process.",
      author: "Rajendra Singh",
      location: "Civil Lines, Ajmer",
      rating: 5
    },
    {
      quote: "The multilingual support is excellent. I was able to submit my complaint in Hindi, which made it much easier for me to explain the issue.",
      author: "Meena Devi",
      location: "Vaishali Nagar, Ajmer",
      rating: 5
    },
    {
      quote: "Being able to upload photos of garbage dumps in my area helped get quick attention from the authorities. Great initiative!",
      author: "Mohammed Farooq",
      location: "Dargah Bazaar, Ajmer",
      rating: 4
    },
    {
      quote: "The water supply in our colony was irregular for months. After raising a complaint through Samasya Seva, the issue was resolved within a week.",
      author: "Kavita Sharma",
      location: "Adarsh Nagar, Ajmer",
      rating: 5
    },
    {
      quote: "I appreciate the feedback system that allows citizens to rate the quality of resolution. It ensures accountability.",
      author: "Pradeep Jain",
      location: "Beawar Road, Ajmer",
      rating: 4
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Citizens Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from Ajmer residents who have used Samasya Seva to resolve civic issues
          </p>
        </div>
        
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      {[...Array(5 - testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gray-300" />
                      ))}
                    </div>
                    <blockquote className="text-gray-600 italic mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="font-medium text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.location}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

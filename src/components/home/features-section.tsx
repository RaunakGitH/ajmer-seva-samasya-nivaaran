
import { CheckCircle, MapPin, FileImage, Clock, Globe, UserCheck } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <FileImage className="h-12 w-12 text-primary" />,
      title: "Image & Video Upload",
      description: "Upload photos or videos of civic issues for faster resolution and better understanding."
    },
    {
      icon: <MapPin className="h-12 w-12 text-primary" />,
      title: "Location Tagging",
      description: "Automatically or manually tag the exact location of the issue using Google Maps."
    },
    {
      icon: <Globe className="h-12 w-12 text-primary" />,
      title: "Multilingual Support",
      description: "Submit complaints in Hindi, Rajasthani, or English - whichever you're comfortable with."
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Real-time Tracking",
      description: "Track the status of your complaint in real-time from submission to resolution."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Feedback System",
      description: "Provide feedback on resolved issues to help improve municipal services."
    },
    {
      icon: <UserCheck className="h-12 w-12 text-primary" />,
      title: "Easy Authentication",
      description: "Quickly sign in with Google or use phone number verification with OTP."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features of Samasya Seva</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy for citizens to report civic issues and for authorities to manage and resolve them efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

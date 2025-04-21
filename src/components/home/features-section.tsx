
import { CheckCircle, MapPin, FileImage, Clock, Globe, UserCheck } from 'lucide-react';

const unsplashImages = [
  // Unsplash IDs correspond to features' order
  "photo-1498050108023-c5249f4df085", // tech desk for media
  "photo-1581091226825-a6a2a5aee158", // location
  "photo-1605810230434-7631ac76ec81", // multi/crowd
  "photo-1531297484001-80022131f5a1", // tracking
  "photo-1526374965328-7f61d4dc18c5", // feedback
  "photo-1519389950473-47ba0277781c" // auth
];

export function FeaturesSection() {
  const features = [
    {
      icon: <FileImage className="h-10 w-10 text-primary drop-shadow-md" />,
      title: "Image & Video Upload",
      description: "Upload photos or videos of civic issues for faster resolution and better understanding.",
      img: unsplashImages[0]
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary drop-shadow-md" />,
      title: "Location Tagging",
      description: "Automatically or manually tag the exact location of the issue using Google Maps.",
      img: unsplashImages[1]
    },
    {
      icon: <Globe className="h-10 w-10 text-primary drop-shadow-md" />,
      title: "Multilingual Support",
      description: "Submit complaints in Hindi, Rajasthani, or English – whichever you're comfortable with.",
      img: unsplashImages[2]
    },
    {
      icon: <Clock className="h-10 w-10 text-primary drop-shadow-md" />,
      title: "Real-time Tracking",
      description: "Track the status of your complaint in real time from submission to resolution.",
      img: unsplashImages[3]
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary drop-shadow-md" />,
      title: "Feedback System",
      description: "Provide feedback on resolved issues to help improve municipal services.",
      img: unsplashImages[4]
    },
    {
      icon: <UserCheck className="h-10 w-10 text-primary drop-shadow-md" />,
      title: "Easy Authentication",
      description: "Quickly sign in with Google or use phone number verification with OTP.",
      img: unsplashImages[5]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-primary drop-shadow">
            Features of Samasya Seva
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy for citizens to report civic issues and for authorities to manage and resolve them efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-0 rounded-xl shadow-md border border-gray-100 overflow-hidden relative hover:shadow-lg hover-scale transition-all duration-200"
            >
              <div className="w-full h-40 relative">
                <img
                  src={`https://images.unsplash.com/${feature.img}?auto=format&fit=crop&w=600&q=80`}
                  alt={feature.title}
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 shadow-lg bg-white/80 rounded-full p-2">
                  {feature.icon}
                </div>
              </div>
              <div className="p-6 pt-5">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

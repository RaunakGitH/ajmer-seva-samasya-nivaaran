
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  MessageSquare
} from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Submit a Complaint",
      description: "Fill out the complaint form with details about the civic issue you're facing."
    },
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "Upload Evidence",
      description: "Add photos or videos of the issue and tag the location for better identification."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Track Progress",
      description: "Receive real-time updates and track the status of your complaint."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Resolution",
      description: "Municipal authorities resolve the issue and mark the complaint as completed."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Provide Feedback",
      description: "Share your feedback on the resolution process to help improve services."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple 5-step process to report and resolve civic issues in Ajmer
          </p>
        </div>
        
        <div className="relative">
          {/* Line connector */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0"></div>
          
          {/* Steps */}
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} items-center`}>
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} mb-6 md:mb-0`}>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                <div className="flex items-center justify-center bg-white rounded-full p-4 border-2 border-primary z-20">
                  {step.icon}
                </div>
                
                <div className="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

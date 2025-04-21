
import { CheckCircle, Clock, Users } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: "10,000+",
      label: "Active Users",
      description: "Citizens actively using Samasya Seva"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      value: "24 Hours",
      label: "Average Response Time",
      description: "Quick initial response to complaints"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      value: "85%",
      label: "Resolution Rate",
      description: "Issues successfully resolved"
    }
  ];

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact in Ajmer</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Making a real difference in the community by efficiently addressing civic issues
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl font-medium mb-2">{stat.label}</div>
                <p className="opacity-90">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

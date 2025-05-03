
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Info, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-background">
        <Container>
          <div className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-purple">Contact Us</h1>
              <p className="text-lg text-gray-600">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Contact Information */}
              <div className="md:col-span-1 space-y-8">
                <div className="bg-dark rounded-lg p-6 shadow-md">
                  <div className="flex items-start">
                    <div className="mr-3 text-purple">
                      <Info className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-white">Office Address</h3>
                      <p className="text-gray-300">
                        Municipal Corporation Ajmer<br />
                        Civil Lines, Ajmer<br />
                        Rajasthan, India - 305001
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark rounded-lg p-6 shadow-md">
                  <div className="flex items-start">
                    <div className="mr-3 text-purple">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-white">Get In Touch</h3>
                      <p className="text-gray-300">
                        Phone: +91 1234567890<br />
                        Email: support@samasyaseva.gov.in<br />
                        Hours: Mon-Fri 9:00AM - 5:00PM
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-500 hover:text-purple transition-colors">
                      <Facebook className="w-6 h-6" />
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-purple transition-colors">
                      <Instagram className="w-6 h-6" />
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-purple transition-colors">
                      <Twitter className="w-6 h-6" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="bg-dark rounded-lg shadow-md p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        className="bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="subject" className="text-white">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message here..."
                        className="min-h-32 bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-purple hover:bg-purple-dark transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Map Section */}
            <div className="border border-gray-700 rounded-lg overflow-hidden h-80 bg-dark flex items-center justify-center">
              <p className="text-gray-400">Interactive map will be displayed here</p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

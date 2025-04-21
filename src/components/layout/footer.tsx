
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <img 
                src="/public/lovable-uploads/6f5b6da4-8245-423e-9396-1653e4505be1.png" 
                alt="Samasya Seva Logo" 
                className="h-10 w-auto mr-2" 
              />
              <span className="text-xl font-bold text-primary">समस्या सेवा</span>
            </Link>
            <p className="mt-3 text-sm text-gray-600">
              A civic complaint management system for the residents of Ajmer, India.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/submit-complaint" className="text-sm text-gray-600 hover:text-primary">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link to="/complaints" className="text-sm text-gray-600 hover:text-primary">
                  Track Complaints
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Important Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://ajmer.rajasthan.gov.in" className="text-sm text-gray-600 hover:text-primary" target="_blank" rel="noreferrer">
                  Ajmer Municipal Corporation
                </a>
              </li>
              <li>
                <a href="https://rajasthan.gov.in" className="text-sm text-gray-600 hover:text-primary" target="_blank" rel="noreferrer">
                  Government of Rajasthan
                </a>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Contact</h3>
            <address className="not-italic">
              <p className="text-sm text-gray-600">
                Municipal Corporation Ajmer<br />
                Civil Lines, Ajmer<br />
                Rajasthan, India - 305001
              </p>
              <p className="text-sm text-gray-600 mt-3">
                <span className="font-medium">Phone:</span> +91 1234567890<br />
                <span className="font-medium">Email:</span> support@samasyaseva.gov.in
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Samasya Seva | Ajmer Municipal Corporation
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="text-sm text-gray-600 hover:text-primary">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

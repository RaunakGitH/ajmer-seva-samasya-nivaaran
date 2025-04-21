import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm dark:bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/public/lovable-uploads/6f5b6da4-8245-423e-9396-1653e4505be1.png" 
                alt="Samasya Seva Logo" 
                className="h-10 w-auto mr-2" 
              />
              <span className="text-xl font-bold text-primary">समस्या सेवा</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link to="/complaints" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              My Complaints
            </Link>
            <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Contact
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Login to Samasya Seva</DialogTitle>
                  <DialogDescription>
                    Login with your Google account or phone number
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="google">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="google">Google</TabsTrigger>
                    <TabsTrigger value="phone">Phone OTP</TabsTrigger>
                  </TabsList>
                  <TabsContent value="google" className="p-4 flex justify-center">
                    <Button className="w-full" variant="outline">
                      <User className="mr-2 h-4 w-4" />
                      Continue with Google
                    </Button>
                  </TabsContent>
                  <TabsContent value="phone" className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+91 123 456 7890" />
                    </div>
                    <Button className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Send OTP
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link to="/complaints" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary">
              My Complaints
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary">
              Contact
            </Link>
            <Button variant="default" className="w-full mt-2">Login</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

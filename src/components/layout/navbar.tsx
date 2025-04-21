
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
import { ProfileMenu } from "@/components/ProfileMenu";
import { useSupabaseSession } from "@/utils/supabaseAuth";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useSupabaseSession();

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
            {session ? (
              <ProfileMenu />
            ) : (
              <Button asChild variant="default" size="sm">
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <ThemeToggle />
            {!session && (
              <Button asChild variant="default" size="sm" className="ml-2">
                <Link to="/auth">Login</Link>
              </Button>
            )}
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
            {session && <ProfileMenu />}
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

interface NavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Navigation({ cartItemCount, onCartClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-amber-800' : 'text-white'
            }`}
          >
            CrftyByCarolyn
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('shop')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-all hover:bg-amber-100 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('shop')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Contact
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

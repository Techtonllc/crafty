import { Heart, Facebook, Instagram, Mail, ShoppingBag } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">CrftyByCarolyn</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Handcrafted treasures for your home. Every creation tells a story, and we're here to help you tell yours through unique, personalized pieces.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/people/Carolyns-crafty-room/100087788164074/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-amber-600 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/carolyntaylor999/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-amber-600 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.etsy.com/shop/crftybycarolyn?ref=dashboard-header"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-amber-600 rounded-full transition-colors"
                aria-label="Etsy Shop"
              >
                <ShoppingBag size={20} />
              </a>
              <a
                href="mailto:crftybycarolyn@gmail.com"
                className="p-2 bg-gray-800 hover:bg-amber-600 rounded-full transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Shipping Information</li>
              <li>Returns & Exchanges</li>
              <li>Custom Orders</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            Made with <Heart className="mx-2 text-red-500" size={16} fill="currentColor" /> by CrftyByCarolyn
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            © {currentYear} CrftyByCarolyn. All rights reserved.
          </p>
          <p className="text-gray-600 mt-3 text-sm">
            Powered by{' '}
            <a
              href="https://techton.cloud/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
            >
              Techton
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

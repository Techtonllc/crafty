import { useEffect, useState } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/70 to-transparent"></div>
      </div>

      <div
        className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Handcrafted Treasures
            <span className="block text-amber-300">For Your Home</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-100 leading-relaxed">
            Every creation tells a story. Discover unique, personalized pieces that transform your space into a warm and welcoming sanctuary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToShop}
              className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-amber-900 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Our Story
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
}

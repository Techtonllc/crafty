import { Heart, Sparkles, Package } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/crafting-workspace.jpg"
                alt="Handcrafted home decor workspace"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-2xl shadow-xl max-w-xs">
              <p className="text-lg font-semibold">Every piece is handcrafted with love and attention to detail</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Crafting Stories, One Piece at a Time
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Welcome to CrftyByCarolyn, where passion meets craftsmanship. What started as a hobby in my home studio has blossomed into a labor of love, creating unique pieces that bring warmth and personality to your space.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Each creation is thoughtfully designed and carefully handmade, ensuring that no two pieces are exactly alike. From seasonal wreaths to personalized home decor, every item is crafted to tell your story and make your house feel like home.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Heart className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Made with Love</h3>
                  <p className="text-gray-600">
                    Every piece is crafted with care and attention to detail, ensuring quality that lasts
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Touch</h3>
                  <p className="text-gray-600">
                    Many items can be customized to perfectly match your style and preferences
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Package className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Carefully Packaged</h3>
                  <p className="text-gray-600">
                    Each order is carefully wrapped and shipped with love, ensuring it arrives in perfect condition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

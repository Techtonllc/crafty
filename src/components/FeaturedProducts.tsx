import { useEffect, useState } from 'react';
import { Star, Heart } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';

interface FeaturedProductsProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export default function FeaturedProducts({ onAddToCart, onProductClick }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Featured Creations</h2>
            <p className="mt-4 text-xl text-gray-600">Handpicked favorites from our collection</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Creations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked favorites from our collection, each crafted with love and attention to detail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onClick={() => onProductClick(product)}
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-amber-50 transition-colors"
                >
                  <Heart
                    size={20}
                    className={favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                  />
                </button>
                {product.compare_at_price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Sale
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3
                  className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-amber-700 transition-colors"
                  onClick={() => onProductClick(product)}
                >
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.short_description}</p>

                <div className="flex items-center mb-4">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(5.0)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.compare_at_price && (
                      <span className="ml-2 text-lg text-gray-400 line-through">
                        ${product.compare_at_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>

                {product.is_customizable && (
                  <p className="mt-3 text-sm text-amber-700 font-medium">✨ Personalization available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

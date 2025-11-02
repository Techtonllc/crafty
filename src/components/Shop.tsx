import { useEffect, useState } from 'react';
import { Star, Heart, Filter } from 'lucide-react';
import { supabase, Product, Category } from '../lib/supabase';

interface ShopProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export default function Shop({ onAddToCart, onProductClick }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  return (
    <section id="shop" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop Our Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover unique handcrafted pieces for every season and occasion
          </p>
        </div>

        <div className="flex items-center justify-center mb-12 flex-wrap gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-amber-100'
            }`}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-amber-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-xl text-gray-600">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                    onClick={() => onProductClick(product)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3E' + encodeURIComponent(product.name) + '%3C/text%3E%3C/svg%3E';
                    }}
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
                  {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                    <div className="absolute bottom-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Only {product.stock_quantity} left!
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
        )}
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

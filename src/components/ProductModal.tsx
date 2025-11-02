import { useState } from 'react';
import { X, Star, ShoppingCart, Heart, CreditCard } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, customization?: string) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, customization || undefined);
    onClose();
    setQuantity(1);
    setCustomization('');
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setIsBuying(true);
    setBuyError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            items: [{ id: product.id, quantity }],
            customization: customization || undefined,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create checkout session';
      setBuyError(message);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-square">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-amber-50 transition-colors"
              >
                <Heart
                  size={24}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                />
              </button>
              {product.compare_at_price && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  Save ${(product.compare_at_price - product.price).toFixed(2)}
                </div>
              )}
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>

              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">(24 reviews)</span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.compare_at_price && (
                  <span className="ml-3 text-2xl text-gray-400 line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {product.is_customizable && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Personalization (Optional)
                  </label>
                  <input
                    type="text"
                    value={customization}
                    onChange={e => setCustomization(e.target.value)}
                    placeholder="Enter your custom text here..."
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-600">{customization.length}/50 characters</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600">{product.stock_quantity} available</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mb-4"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>

              {buyError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {buyError}
                </div>
              )}

              <button
                onClick={handleBuyNow}
                disabled={isBuying}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <CreditCard size={20} />
                <span>{isBuying ? 'Processing...' : 'Buy with Stripe'}</span>
              </button>

              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold mr-2">Category:</span>
                  <span>{product.tags?.[0] || 'Home Decor'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold mr-2">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags?.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

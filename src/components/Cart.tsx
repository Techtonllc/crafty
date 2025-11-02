import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../lib/supabase';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ product: Product; quantity: number }>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onClearCart }: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const checkoutItems = items.map(item => ({
        name: item.product.name,
        description: item.product.short_description,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image_url,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            items: checkoutItems,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        onClearCart();
        window.location.href = data.url;
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const message = error instanceof Error ? error.message : 'Failed to create checkout session';
      setCheckoutError(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-amber-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="text-gray-400 mb-4" size={64} />
              <p className="text-xl text-gray-600 mb-2">Your cart is empty</p>
              <p className="text-gray-500 mb-6">Add some beautiful handcrafted items!</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex space-x-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                      <p className="text-amber-600 font-bold mb-2">${item.product.price.toFixed(2)}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemove(item.product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal < 50 && (
                <p className="text-sm text-amber-600">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {checkoutError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {checkoutError}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 disabled:bg-gray-400 transition-colors shadow-lg hover:shadow-xl"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

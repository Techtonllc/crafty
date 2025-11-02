import { CheckCircle, Package, Mail, Home } from 'lucide-react';

export default function ThankYou() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Your purchase means the world to us. We're so excited to craft your special piece!
          </p>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-gray-800 font-semibold mb-2">
              Order Confirmation Sent
            </p>
            <p className="text-gray-600">
              Check your email for order details and tracking information once your item ships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
              <Package className="text-amber-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Handcrafted with Care</h3>
              <p className="text-sm text-gray-600 text-center">
                Your item will be lovingly handmade and carefully packaged
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
              <Mail className="text-amber-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 text-center">
                We'll keep you informed every step of the way
              </p>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home size={20} />
            <span>Continue Shopping</span>
          </button>

          <p className="mt-8 text-gray-500 text-sm">
            Questions about your order? Contact us at{' '}
            <a
              href="mailto:crftybycarolyn@gmail.com"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              crftybycarolyn@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

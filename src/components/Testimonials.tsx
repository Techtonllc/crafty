import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'Austin, TX',
    rating: 5,
    text: 'I absolutely love my spring wreath! The quality is outstanding and it looks even better in person. Carolyn was so helpful throughout the entire process. I get compliments from everyone who visits!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  },
  {
    id: 2,
    name: 'Jennifer L.',
    location: 'Nashville, TN',
    rating: 5,
    text: 'Ordered a personalized cutting board as a wedding gift for my best friend and she absolutely loved it! The engraving is crisp and clear, and the bamboo is high quality. Highly recommend!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  },
  {
    id: 3,
    name: 'Michelle R.',
    location: 'Atlanta, GA',
    rating: 5,
    text: 'This door hanger is the perfect addition to our front porch! The colors are exactly what I wanted and the craftsmanship is excellent. It feels sturdy and looks professionally made.',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
              }}
            >
              <Quote className="text-amber-500 mb-4" size={32} />

              <div className="flex text-amber-500 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={20} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-amber-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Join Our Happy Customers</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the joy of handcrafted treasures that make your house feel like home
          </p>
          <button
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-amber-900 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </button>
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

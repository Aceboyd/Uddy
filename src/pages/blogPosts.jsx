import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Headers from '../Components/Nav/Header';

// Reuse or import your blog data
const blogPosts = [
  {
    id: 'summer-dress-trends-2025',
    title: 'Top 5 Summer Dress Trends for 2025',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content:
      'Summer 2025 is all about bold colors, lightweight fabrics, and versatile designs. Floral maxi dresses are making a comeback with vibrant patterns, while chic mini dresses in pastel shades are perfect for casual outings. Don’t miss the return of slip dresses, which pair effortlessly with strappy sandals or chunky boots. For evening looks, opt for asymmetrical hemlines that add a modern twist. Complete your wardrobe with sustainable fabrics like organic cotton and linen for a stylish yet eco-friendly summer.',
  },
  {
    id: 'perfect-handbag-guide',
    title: 'How to Choose the Perfect Handbag',
    image: 'https://images.unsplash.com/photo-1584917865442-6fc7e608b5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content:
      'Choosing the right handbag is an art. Start with functionality: consider size, compartments, and durability for daily use. For style, match your bag to your wardrobe—neutral tones like beige or black are versatile, while bold colors like red or emerald make a statement. Crossbody bags are great for hands-free convenience, while structured totes elevate office looks. Don’t forget to check the material—leather for longevity or canvas for a casual vibe.',
  },
  {
    id: 'seasonal-shoe-styles',
    title: 'Shoe Styles for Every Season',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content:
      'Your shoe collection should be as dynamic as the seasons. For spring, try ballet flats or loafers in soft pastels. Summer calls for strappy sandals or espadrilles that keep you cool and stylish. Fall is perfect for ankle boots in rich tones like burgundy or olive. In winter, invest in knee-high boots or waterproof sneakers for both warmth and fashion.',
  },
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!id) return null; // don't show anything if no id in URL
  // Get latest updates excluding current post
  const latestPosts = blogPosts.filter((p) => p.id !== id);

  return (
    <div>
      <Headers />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pt-20 sm:pt-24"> {/* Responsive padding */}
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-6"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">{post.content}</p>

        {/* Latest fashion updates */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 sm:mt-12 mb-4">
          Latest Fashion Updates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {latestPosts.map((latest) => (
            <div key={latest.id} className="bg-white shadow rounded-lg overflow-hidden">
              <img
                src={latest.image}
                alt={latest.title}
                className="w-full h-auto max-h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold">{latest.title}</h3>
                <Link
                  to={`/blog/${latest.id}`}
                  className="text-pink-600 hover:underline text-sm sm:text-base font-medium"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
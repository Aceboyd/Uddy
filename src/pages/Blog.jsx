import React from 'react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 'summer-dress-trends-2025',
    title: 'Top 5 Summer Dress Trends for 2025',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80',
    excerpt: 'Discover the hottest dress styles for summer 2025, from floral maxis to chic minis, perfect for any occasion.',
    content: 'Summer 2025 is all about bold colors, lightweight fabrics, and versatile designs. Floral maxi dresses are making a comeback with vibrant patterns, while chic mini dresses in pastel shades are perfect for casual outings. Don’t miss the return of slip dresses, which pair effortlessly with strappy sandals or chunky boots. For evening looks, opt for asymmetrical hemlines that add a modern twist. Complete your wardrobe with sustainable fabrics like organic cotton and linen for a stylish yet eco-friendly summer.',
  },
  {
    id: 'perfect-handbag-guide',
    title: 'How to Choose the Perfect Handbag',
    image: 'https://images.unsplash.com/photo-1584917865442-6fc7e608b5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80',
    excerpt: 'Find the ideal handbag that matches your style, needs, and personality with our expert tips.',
    content: 'Choosing the right handbag is an art. Start with functionality: consider size, compartments, and durability for daily use. For style, match your bag to your wardrobe—neutral tones like beige or black are versatile, while bold colors like red or emerald make a statement. Crossbody bags are great for hands-free convenience, while structured totes elevate office looks. Don’t forget to check the material—leather for longevity or canvas for a casual vibe. At BlissByUddy, we offer a range of handbags to suit every occasion.',
  },
  {
    id: 'seasonal-shoe-styles',
    title: 'Shoe Styles for Every Season',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80',
    excerpt: 'Explore versatile footwear to elevate your wardrobe year-round, from boots to sandals.',
    content: 'Your shoe collection should be as dynamic as the seasons. For spring, try ballet flats or loafers in soft pastels. Summer calls for strappy sandals or espadrilles that keep you cool and stylish. Fall is perfect for ankle boots in rich tones like burgundy or olive. In winter, invest in knee-high boots or waterproof sneakers for both warmth and fashion. At BlissByUddy, our curated selection ensures you step out in style no matter the weather.',
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-pink-50">
      <header className="py-4 sm:py-6 text-center">
        <h1 className="text-xl sm:text-4xl tab:text-[28px] font-bold tracking-wide henny-penny text-pink-600">
          Blog
        </h1>
      </header>
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-full sm:max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
            Fashion Tips & Trends
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-auto max-h-48 object-cover" />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{post.excerpt}</p>
                  <Link to={`/blogpost/${post.id}`} className="text-pink-600 hover:underline text-sm sm:text-base font-medium">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
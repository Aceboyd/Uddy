import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Testimony = () => {
  const testimonials = [
    { quote: "I love the quality of the dresses from BlissByUddy! They fit perfectly and make me feel amazing.", name: "Amaka Okeke", title: "Fashion Enthusiast", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    { quote: "The bags and shoes I bought are stylish and durable. BlissByUddy is my go-to store!", name: "Chioma Nwosu", title: "Entrepreneur", image: "https://images.unsplash.com/photo-1524504388940-b792b4655b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    { quote: "BlissByUddy's customer service is top-notch! My order arrived quickly and in perfect condition.", name: "Tolu Adebayo", title: "Blogger", image: "https://images.unsplash.com/photo-1531123414780-8a77f9527eb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    { quote: "The jewelry collection is stunning. I get compliments every time I wear my BlissByUddy earrings!", name: "Fatima Ibrahim", title: "Teacher", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    { quote: "Their designs are so unique and vibrant. I feel like a queen in my BlissByUddy outfits!", name: "Ngozi Eze", title: "Event Planner", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    { quote: "Every order feels special, from packaging to the product itself. BlissByUddy never disappoints!", name: "Blessing Okafor", title: "Model", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    { quote: "The outfits are classy, comfortable, and always turn heads. I’m a loyal customer for life!", name: "Ifeanyi Umeh", title: "Photographer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    // Added new testimonials
    { quote: "I wore a BlissByUddy gown to my friend’s wedding and everyone kept asking where I got it!", name: "Sandra Obiora", title: "Marketing Specialist", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
    { quote: "From casual wear to formal dresses, BlissByUddy delivers elegance every single time.", name: "Adaeze Nwachukwu", title: "Lawyer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonialsPerView = 3;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerView);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, totalSlides]);

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div
      id="testimonials"
      className="min-h-screen bg-pink-50 font-poppins"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <header className="py-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide font-eb-garamond text-pink-600">
          Testimonials
        </h1>
      </header>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center font-eb-garamond">
            What Our Customers Say
          </h2>

          <div className="overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="flex w-full"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6 }}
              >
                {testimonials
                  .slice(currentIndex * testimonialsPerView, currentIndex * testimonialsPerView + testimonialsPerView)
                  .map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className="w-full sm:w-1/2 lg:w-1/3 px-2"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 h-full">
                        <p className="text-gray-600 italic mb-4 text-sm sm:text-base font-poppins">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 object-cover"
                          />
                          <div>
                            <p className="text-gray-900 font-semibold text-sm sm:text-base font-poppins">
                              {testimonial.name}
                            </p>
                            <p className="text-gray-500 text-xs sm:text-sm font-poppins">
                              {testimonial.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimony;

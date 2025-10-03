import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Testimony = () => {
  const testimonials = [
    { quote: "I love the quality of the dresses from BlissByUddy! They fit perfectly and make me feel amazing.", name: "Amaka Okeke", title: "Fashion Enthusiast", image: "https://images.unsplash.com/photo-1644152993066-9b9ee687930d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "The bags and shoes I bought are stylish and durable. BlissByUddy is my go-to store!", name: "Chioma Nwosu", title: "Entrepreneur", image: "https://images.unsplash.com/photo-1615453261261-77494754424e?q=80&w=755&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "BlissByUddy's customer service is top-notch! My order arrived quickly and in perfect condition.", name: "Tolu Adebayo", title: "Blogger", image: "https://images.unsplash.com/photo-1596960198491-fc2ed81c55ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "The jewelry collection is stunning. I get compliments every time I wear my BlissByUddy earrings!", name: "Fatima Ibrahim", title: "Teacher", image: "https://images.unsplash.com/photo-1618944207632-4064a84f4e5f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "Their designs are so unique and vibrant. I feel like a queen in my BlissByUddy outfits!", name: "Ngozi Eze", title: "Event Planner", image: "https://images.unsplash.com/photo-1590123375983-46f31745a14d?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "Every order feels special, from packaging to the product itself. BlissByUddy never disappoints!", name: "Blessing Okafor", title: "Model", image: "https://images.unsplash.com/photo-1687786918818-92c0c9057317?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "The outfits are classy, comfortable, and always turn heads. I’m a loyal customer for life!", name: "Ifeanyi Umeh", title: "Photographer", image: "https://images.unsplash.com/photo-1586171984069-1dbce3573a10?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "I wore a BlissByUddy gown to my friend’s wedding and everyone kept asking where I got it!", name: "Sandra Obiora", title: "Marketing Specialist", image: "https://images.unsplash.com/photo-1613876214855-407ce0d838fb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { quote: "From casual wear to formal dresses, BlissByUddy delivers elegance every single time.", name: "Adaeze Nwachukwu", title: "Lawyer", image: "https://images.unsplash.com/photo-1681597107753-58e48bb38c32?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [testimonialsPerView, setTestimonialsPerView] = useState(3);

  // ✅ Responsive items per view
  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) setTestimonialsPerView(1);
      else if (window.innerWidth < 1024) setTestimonialsPerView(2);
      else setTestimonialsPerView(3);
    };

    updateView(); // run on mount
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / testimonialsPerView);

  // Auto slide
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, totalSlides]);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % totalSlides);

  return (
    <div
      id="testimonials"
      className="py-12 sm:py-16 lg:py-20 bg-white font-poppins" // ✅ removed min-h-screen
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <header className="py-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide font-eb-garamond text-pink-600 henny-penny mb-9">
          Testimonials
        </h1>
      </header>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-10 text-center font-eb-garamond">
            What Our Customers Say
          </h2>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="flex w-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
              >
                {testimonials
                  .slice(
                    currentIndex * testimonialsPerView,
                    currentIndex * testimonialsPerView + testimonialsPerView
                  )
                  .map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className="w-full sm:w-1/2 lg:w-1/3 px-3"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      <div className="bg-white rounded-xl shadow-md border p-6 h-full">
                        <p className="text-gray-700 italic mb-4 text-sm sm:text-base font-poppins">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full mr-4 object-cover border"
                          />
                          <div>
                            <p className="text-gray-900 font-semibold text-base font-poppins">
                              {testimonial.name}
                            </p>
                            <p className="text-gray-500 text-sm font-poppins">
                              {testimonial.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-pink-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-pink-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-pink-50 transition"
            >
              <ChevronRight className="w-5 h-5 text-pink-600" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === currentIndex ? "bg-pink-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimony;

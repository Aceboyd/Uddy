import React, { useState, useEffect } from "react";
import BGIMG from "/BGIMG.jpg";
import BGIMG3 from "/BGIMG3.jpg";
import BGIMG2 from "/BGIMG2.jpg";
import BGIMG4 from "/BGIMG4.jpg";
import BGIMG5 from "/BGIMG5.jpg";

const slides = [
  {
    image: BGIMG3,
    align: "left",
    title: (
      <>
        <span className="text-pink-500">New</span> Explore Bliss Collection
        2025 – Your Journey to Timeless Elegance Starts Here
      </>
    ),
    font: "default",
  },
  {
    image: BGIMG4,
    align: "left",
    title: (
      <>
        Elevate Your <span className="text-pink-500">Wardrobe</span> – From
        Power Dressing to Weekend Chic, We’ve Got You Covered
      </>
    ),
    font: "default",
  },
  {
    image: BGIMG5,
    align: "left",
    title: (
      <>
        Step into <span className="text-pink-500">Class</span> – Defines
        Confidence with Every Step
      </>
    ),
    font: "modern",
  },
  {
    image: BGIMG,
    align: "center",
    title: (
      <>
        The <span className="text-pink-500">Exclusive</span> Collection –
        Crafted for Those Who Desire More Than Just Fashion
      </>
    ),
    font: "default",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[current];

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-start text-white pl-4 sm:pl-[5%] z-0">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.image}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover object-center brightness-90 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-[-1]" : "opacity-0 z-[-2]"
          }`}
        />
      ))}

      {/* Animated Polygons - Background layer */}
      <ul className="absolute top-0 left-0 w-full h-full m-0 p-0 list-none overflow-hidden z-10 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <li
            key={i}
            className="absolute block bg-white/20 animate-float"
            style={{
              left: ["25%", "10%", "70%", "40%", "85%"][i],
              width: ["20px", "15px", "30px", "10px", "20px"][i],
              height: ["20px", "15px", "30px", "10px", "20px"][i],
              animationDuration: ["20s", "22s", "18s", "25s", "20s"][i],
              animationDelay: ["0s", "2s", "0s", "1s", "3s"][i],
              bottom: "-150px",
            }}
          ></li>
        ))}
      </ul>

      {/* Hero Content - Foreground layer */}
      <div
        className={`relative z-20 max-w-[90%] sm:max-w-[600px] ${
          currentSlide.align === "center"
            ? "mx-auto text-center self-center"
            : currentSlide.align === "right"
            ? "ml-auto mr-[5%] text-right"
            : "text-left"
        } ${
          currentSlide.font === "modern"
            ? "eb-garamond font-bold text-[36px] sm:text-[56px] tracking-wider"
            : "eb-garamond font-semibold text-[32px] sm:text-[48px] tracking-wide"
        }`}
      >
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight eb-garamond">{currentSlide.title}</h1>
        {currentSlide.tagline && (
          <p className="poppins text-base sm:text-lg mt-2 sm:mt-4 text-black">{currentSlide.tagline}</p>
        )}
        <button className="mt-4 sm:mt-8 px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-transparent text-white border-2 border-white cursor-pointer transition-all duration-300 hover:bg-pink-500 hover:text-black hover:border-pink-500 poppins">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Hero;
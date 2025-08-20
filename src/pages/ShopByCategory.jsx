import React from "react";
import { Link } from "react-router-dom";

import CATIMG from "/CATIMG.jpg";
import CATIMG2 from "/CATIMG2.jpg";
import CATIMG3 from "/CATIMG3.jpg";
import CATIMG4 from "/CATIMG4.jpg";

const categories = [
  { name: "Bags", image: CATIMG2, description: "Stylish and functional bags for every occasion." },
  { name: "Cloths", image: CATIMG3, description: "Trendy clothing to elevate your wardrobe." },
  { name: "Footwears", image: CATIMG, description: "Comfortable and fashionable footwear." },
  { name: "Assessories", image: CATIMG4, description: "Perfect add-ons to complete your look." },
];

const ShopByCategory = () => {
  return (
    <section id="shop-by-category" className="mt-8 sm:mt-16 p-4 sm:p-8 bg-gray-50">
      <h1 className="text-center mb-8 sm:mb-16 text-[30px] font-semibold">
        Shop by Category
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            to={`/category/${category.name.toLowerCase()}`}
            key={category.name}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-[100px] sm:h-[200px] object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="text-base sm:font-medium mb-2">{category.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;

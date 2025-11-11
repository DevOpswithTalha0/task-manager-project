import React from "react";

export default function TrustedBy() {
  const categories = [
    "Tech Startups",
    "Agencies",
    "Freelancers",
    "Product Teams",
    "Marketing Teams",
  ];

  return (
    <section className="mt-10 py-12 px-6 sm:px-10 lg:px-20 text-center bg-gradient-to-b bg-transplant rounded-3xl w-full mx-auto">
      {/* Heading */}
      <h2 className="text-base sm:text-lg text-gray-700 mb-10 font-medium tracking-wide">
        Trusted by teams and individuals around the world
      </h2>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {categories.map((item, index) => (
          <div
            key={index}
            className="text-sm sm:text-base md:text-lg font-medium bg-white text-gray-700 
              px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-gray-200 
              shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-violet-300 
              transition-all duration-300 cursor-default"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

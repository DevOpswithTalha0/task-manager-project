import React from "react";
import Navbar from "../components/layout/Navbar";
import Overview from "../components/sections/Overview";
import TrustedBy from "../components/sections/TrustedBy";
import Features from "../components/sections/Features";
import PricingPlan from "../components/sections/PricingPlan";
import Reviews from "../components/sections/Reviews";
import Footer from "../components/sections/Footer";
import { Link } from "react-router-dom";
import WhyChooseUs from "../components/sections/WhyChooseUs";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-violet-50 via-white to-white text-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        id="Home"
        className="relative flex flex-col justify-center items-center text-center py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
      >
        {/* Soft grid & glow background */}
        <div
          className="absolute inset-0 z-0 opacity-90"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220,220,255,0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220,220,255,0.4) 1px, transparent 1px),
              radial-gradient(circle 800px at 10% 200px, #e1d3ff, transparent 70%)
            `,
            backgroundSize: "90px 64px, 90px 64px, 100% 100%",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-heading text-4xl md:text-5xl lg:text-6xl  leading-tight mb-3 font-semibold">
            Need More Focus?
          </p>
          <p className="font-heading text-4xl md:text-5xl lg:text-6xl  leading-tight font-semibold text-violet-800 mb-6">
            PlanOra Keeps You on Track.
          </p>

          <p className="font-body text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            From personal goals to team projects, PlanOra helps you organize
            tasks, track progress, and stay productive effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={"/register"}
              className="px-8 py-3 bg-violet-400 text-black font-semibold rounded-full shadow-md hover:bg-violet-500 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-105 hover:text-white"
            >
              Start for Free
            </Link>
            <button className="px-8 py-3 border border-gray-400 text-black font-semibold rounded-full hover:bg-gray-100 hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer  ">
              Explore Features
            </button>
          </div>
        </div>

        {/* Floating glow orbs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse" />

        {/* Overview preview below */}
        <div className="relative z-10 mt-24 w-full">
          <Overview />
        </div>
      </section>

      {/* Rest of the Landing Page */}
      <main className="flex flex-col justify-center items-center">
        <TrustedBy />
        <WhyChooseUs />
        <Features />
        <PricingPlan />
        <Reviews />
      </main>

      <Footer />
    </div>
  );
}

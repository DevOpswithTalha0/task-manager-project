import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "../../assets/newLogo.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={Image} alt="Planora Logo" className="h-7 w-7" />
          <h1 className="text-2xl font-heading font-medium text-gray-700 cursor-pointer">
            PlanOra
          </h1>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 font-body text-gray-700">
          <a href="/" className="hover:text-violet-600 transition">
            Home
          </a>
          <a href="#features" className="hover:text-violet-600 transition">
            Features
          </a>
          <a href="#pricing" className="hover:text-violet-600 transition">
            Pricing
          </a>
          <a href="#contact" className="hover:text-violet-600 transition">
            Contact
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-700 font-body hover:text-violet-600 transition cursor-pointer"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-violet-500 text-white rounded-full font-medium cursor-pointer hover:bg-violet-600 transition hover:-translate-y-1 hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

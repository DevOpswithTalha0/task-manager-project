import React from "react";
import Image from "../../assets/newLogo.jpg";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-slate-800  text-gray-300 py-12 px-6 md:px-12 lg:px-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={Image} alt="Planora Logo" className="h-8 w-8 rounded" />
            <h1 className="text-2xl font-bold text-white cursor-pointer">
              Planora
            </h1>
          </div>
          <p className="text-sm leading-6 mb-4">
            Helping teams, freelancers, and agencies stay productive and manage
            tasks with ease.
          </p>

          {/* Socials */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Follow Us</h2>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="hover:text-white" aria-label="Facebook">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 0 1 3.7-3.9c1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.5.8-1.5 1.5V12H16l-.5 3h-2v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="hover:text-white" aria-label="Twitter">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.1 1.5 4.5 4.5 0 0 0-7.7 3v1A10.7 10.7 0 0 1 3 4s-4 9 5 13a11.6 11.6 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.1-1A7.7 7.7 0 0 0 23 3z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="hover:text-white" aria-label="LinkedIn">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="hover:text-white" aria-label="Instagram">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .1 10.1A5 5 0 0 0 12 7zm0 2a3 3 0 1 1-.1 6.1A3 3 0 0 1 12 9zm4.8-3.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Main Menu</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Integrations
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Documentation
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Company</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Contact Us</h2>
          <p className="text-sm leading-6 mb-4">
            Reach out anytime for questions, feedback, or custom support.
          </p>
          <button className="px-4 py-2.5 cursor-pointer bg-amber-300 text-black text-sm rounded-full hover:bg-amber-400 transition">
            Get Custom Support
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Planora. All rights reserved.
      </div>
    </footer>
  );
}

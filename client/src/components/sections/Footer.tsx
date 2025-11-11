import React, { useState } from "react";
import Logo from "../../assets/newLogo.png";
import { Mail } from "lucide-react";

export default function Footer() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    // Example: Random response simulation
    const responses = [
      "Thanks for reaching out!",
      "Message received! We'll get back to you soon.",
      "We appreciate your message!",
      "Your message has been sent successfully!",
    ];
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    console.log("User message:", message);
    console.log("Response:", randomResponse);

    // optional pop-up
    setMessage(""); // clear textarea
  };

  return (
    <section id="contact" className="text-gray-300 py-7 px-6 md:px-12 lg:px-24">
      {/* --- Top Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-8">
        {/* --- Left Column --- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="PlanOra logo" className="w-8 h-8 rounded" />
            <h1 className="text-xl font-medium text-gray-900 ">PlanOra</h1>
          </div>

          <p className="text-sm text-gray-600 leading-6 max-w-md">
            Simplifying project management for teams, freelancers, and
            businesses. Stay on top of your goals smart, fast, and organized.
          </p>

          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
            {" "}
            <span className="inline-block">
              <Mail className="w-5 h-5" />
            </span>
            connect@planora.com
          </p>
        </div>

        {/* --- Right Column --- */}
        <div className="flex flex-col gap-3 relative">
          <div className="relative w-full">
            <textarea
              placeholder="Send your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-40 p-3 pr-20 text-sm rounded-lg bg-violet-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none text-black"
            />
            <button
              onClick={handleSend}
              className="absolute bottom-3 right-2 bg-violet-500 hover:bg-violet-600 text-white font-medium px-4 py-1 rounded transition cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* --- Divider --- */}

      {/* --- Bottom Section --- */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-3 mt-6 pt-12">
        <p>© 2025 PlanOra. All rights reserved.</p>

        <div className="flex gap-5">
          <a href="#" className="hover:text-violet-500-amber-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-violet-500 transition">
            Terms of Service
          </a>
        </div>
      </div>
    </section>
  );
}

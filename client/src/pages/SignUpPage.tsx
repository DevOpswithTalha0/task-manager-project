import React, { useState, type ChangeEvent, type FormEvent } from "react";
import Logo from "../assets/newLogo.jpg";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils/utils";
import { useNavigate } from "react-router-dom";

type SignUpInfo = {
  name: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const [signupInfo, setSignUpInfo] = useState<SignUpInfo>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password)
      return handleError("All fields are required");

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });

      const data = await response.json();
      if (response.ok) {
        handleSuccess(data.message || "Signup successful!");
        setTimeout(() => navigate("/login"), 1000);
      } else handleError(data.message || "Something went wrong");
    } catch (err: any) {
      handleError(err.message || "Network error");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 ">
      {/* Left Section - Form */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md   rounded-2xl ">
          {/* Logo + Title */}
          <div className="flex items-center mb-6 gap-3">
            <img src={Logo} alt="PlanOra Logo" className="w-12 h-12" />
            <h1 className="text-3xl font-semibold text-violet-900">PlanOra</h1>
          </div>

          <h2 className="text-2xl sm:text-2xl font-medium text-gray-800 mb-2">
            Get Started Now
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Create your account and start managing your tasks efficiently
          </p>

          {/* Form */}
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={signupInfo.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoFocus
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={signupInfo.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={signupInfo.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 accent-violet-500 cursor-pointer"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-violet-500 hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <button className="w-full py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition text-sm sm:text-base font-medium cursor-pointer">
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-left text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-violet-500 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Hero */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl m-5 text-white p-10 shadow-lg">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-4 text-center">
          Manage Tasks with Ease
        </h1>
        <p className="text-base lg:text-lg text-center max-w-md">
          PlanOra helps you stay productive, whether you’re a freelancer,
          agency, or part of a team. Track projects, tasks, and deadlines
          effortlessly.
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

import React from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Section: Branding / Hero */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex-col items-center justify-center p-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to DriveIQ </h1>
        <p className="text-lg opacity-90 max-w-md text-center">
          Find your dream car with ease. Sign in to manage your reservations and saved cars.
        </p>
      </div>

      {/* Right Section: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600">DriveIQ</h1>
          </div>

          {/* Render the passed Clerk form (SignIn or SignUp) */}
          <div className="shadow-lg rounded-2xl border border-gray-100 p-6 bg-white">
            {children}
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} DriveIQ. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

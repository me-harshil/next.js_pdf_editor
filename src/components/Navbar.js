"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="navbar">
      <div className="sticky top-0 z-10 bg-white shadow-xl">
        <header className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <Link
              href="/"
              className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
            >
              <span className="ml-3 text-xl">PDF Editor</span>
            </Link>
            <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              <Link
                href="/"
                className={`mr-5 hover:text-blue-700 ${
                  router.pathname === "/" ? "text-blue-700" : "text-gray-600"
                }`}
              >
                Home
              </Link>
             
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Navbar;

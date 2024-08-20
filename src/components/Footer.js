import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <footer className="text-gray-600 body-font">
        <div className="bg-gray-100">
          <div className="container px-5 py-6 mx-auto flex flex-col sm:flex-row items-center justify-between">
            <a className="flex title-font font-medium items-center text-gray-900">
              <span className="ml-3 text-xl">PDF Editor</span>
            </a>
            <p className="text-sm text-gray-500 sm:mt-0 mt-4 text-center sm:text-left">
              © 2024 PDF Editor - All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

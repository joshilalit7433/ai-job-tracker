import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left lg:ml-[80px] mb-6 md:mb-0">
          <h3 className="text-xl font-bold">TARGETAIMS</h3>
          <p className="text-sm mt-2">
            mail- TARGETAIMS@gmail.com
            <br />
            phone-9089085655
          </p>
          <div className="mt-4"></div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold">Quick Links</h3>
          <ul className="mt-2">
            <li>
              <a href="/" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-gray-300">
                About Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-gray-300">
                Contact Us
              </a>
            </li>
           
          </ul>
        </div>
        <div className="text-center md:text-right lg:mr-[80px]">
          <p className="text-sm">Copyright © TARGET AIMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

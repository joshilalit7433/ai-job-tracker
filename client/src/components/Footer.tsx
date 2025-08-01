import React from "react";
import { FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left lg:ml-[80px] mb-6 md:mb-0">
          <h3 className="text-xl font-bold">TARGETAIMS</h3>
          <p className="text-sm mt-2">
            mail - TARGETAIMS@gmail.com
            <br />
            phone - 9089085655
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-4 text-xl">
            <a href="https://x.com/LalitJoshi2104" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="hover:text-gray-400" />
            </a>
            <a href="https://www.linkedin.com/in/lalit-joshi-73ba50255/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-gray-400" />
            </a>
            <a href="https://github.com/joshilalit7433" target="_blank" rel="noopener noreferrer">
              <FaGithub className="hover:text-gray-400" />
            </a>
          </div>
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
              <a href="/job-applications" className="hover:text-gray-300">
                Job Applications
              </a>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-right lg:mr-[80px]">
          <p className="text-sm">© {new Date().getFullYear()} TARGETAIMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

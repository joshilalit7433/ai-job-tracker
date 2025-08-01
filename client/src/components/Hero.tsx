import React from "react";
import { Search, MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative bg-[#f7e9d6] min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-16 flex flex-col lg:flex-row items-center justify-between pt-[72px] relative z-10">
       
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl lg:text-5xl font-black text-[#131D4F] leading-tight relative">
            Discover <br /> more than <br />
            <span className="text-[#4a6cf7] inline-block relative">
              5000+ Jobs
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 6 C50 10, 150 0, 200 6"
                  stroke="#4a6cf7"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-gray-700 text-md">
            Our platform generates a personalized cover letter based on your resume
            and the job description you're applying to.
          </p>
        </div>

        <div className="mt-20 lg:mt-20">
          <img
            src="/images/job-seeker.png"
            alt="Job Seeker"
            className="w-[400px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

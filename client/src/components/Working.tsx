import React from "react";

const Working = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7e9d6] via-[#f5e6d3] to-[#f3e3d0] flex flex-col items-center py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-32 right-20 w-40 h-40 bg-gradient-to-br from-[#4a6cf7]/20 to-[#6c5ce7]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-32 h-32 bg-gradient-to-br from-[#fd79a8]/20 to-[#fdcb6e]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-[#00b894]/10 to-[#00cec9]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-[#4a6cf7] mb-8 shadow-lg">
            <span className="w-2 h-2 bg-[#4a6cf7] rounded-full mr-2 animate-pulse"></span>
            Process Overview
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#131D4F] mb-6 leading-tight">
            How it{" "}
            <span className="relative inline-block">
              <span className="text-[#4a6cf7] relative z-10">Works</span>
              <svg
                className="absolute -bottom-3 left-0 w-full h-4 text-[#4a6cf7]/30"
                viewBox="0 0 120 16"
                fill="none"
              >
                <path
                  d="M2 10.5c20-2 40-2 60 0s40 2 60 0"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#131D4F]/70 font-light max-w-3xl mx-auto">
            Simple, streamlined process to get you from application to success
          </p>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-24 w-full">
          {/* Step 1 */}
          <div className="flex flex-col items-center group relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 -right-12 w-24 h-0.5 bg-gradient-to-r from-[#4a6cf7]/30 to-[#4a6cf7]/10 transform -translate-y-1/2"></div>

            <div className="relative">
              <img
                src="public/images/step1.png"
                alt="Step 1 - Login Process"
                className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 "
              />
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[#4a6cf7] to-[#6c5ce7] rounded-full flex items-center justify-center text-white font-bold text-base shadow-xl">
                1
              </div>
            </div>

            <div className="text-center max-w-sm mt-10">
              <div className="text-2xl md:text-3xl font-bold text-[#131D4F] mb-4">
                Login & Start
              </div>
              <p className="text-lg md:text-xl text-[#131D4F]/70 leading-relaxed">
                Secure login to access our comprehensive job application
                platform
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center group relative">
            <div className="relative">
              <img
                src="public/images/step2.png"
                alt="Step 2 - Apply Process"
                className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 "
              />
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[#6c5ce7] to-[#4a6cf7] rounded-full flex items-center justify-center text-white font-bold text-base shadow-xl">
                2
              </div>
            </div>

            <div className="text-center max-w-sm mt-10">
              <div className="text-2xl md:text-3xl font-bold text-[#131D4F] mb-4">
                AI-Powered Application
              </div>
              <p className="text-lg md:text-xl text-[#131D4F]/70 leading-relaxed">
                <span className="whitespace-nowrap">
                  Upload your resume and get an{" "}
                  <span className="font-semibold text-[#4a6cf7] bg-[#4a6cf7]/10 px-1 py-[1px] rounded-md inline align-baseline">
                    AI-generated
                  </span>{" "}<br/>
                  cover letter instantly
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="mt-24 w-full max-w-4xl mx-auto">
          <div className="relative group">
            {/* Background card */}
            <div className="absolute inset-0 bg-white/60 opacity-30 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/10 group-hover:shadow-3xl group-hover:shadow-black/15 transition-all duration-500"></div>

            <div className="relative p-10 md:p-12 text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#131D4F] mb-4">
                Ready to Transform Your Job Search?
              </div>
              <p className="text-lg md:text-xl text-[#131D4F]/70 mb-8">
                Join thousands of professionals who've streamlined their
                application process
              </p>

              {/* Feature benefits */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-[#131D4F]">
                    Instant AI Cover Letters
                  </span>
                </div>
                <div className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-[#131D4F]">
                    Smart Job Matching
                  </span>
                </div>
                <div className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-[#131D4F]">
                    Application Tracking
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Working;
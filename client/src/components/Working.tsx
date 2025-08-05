import React from 'react';

const Working = () => {
  return (
    <div className="min-h-screen bg-[#F7F1E8] flex flex-col items-center py-12 px-4 font-['Inter','Poppins','Montserrat',sans-serif]">
      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl lg:text-5xl font-bold text-slate-800 mb-4 relative">
          How it Works
          <div className="absolute  left-0 right-0  h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </h1>
      </div>
      
      {/* Steps Container */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-20 w-full max-w-7xl">
        {/* Step 1: Login */}
        <div className="flex flex-col items-center group">
          {/* Step 1 Image */}
          <div className="relative transform transition-all duration-300 group-hover:scale-105">
            <img
              src='public/images/step1.png'
              alt="Step 1 - Login Process"
              className='w-64 h-64 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px]  rounded-bl-[50px] rounded-tr-[50px] shadow-xl hover:shadow-2xl transition-all duration-300'
            />
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              1
            </div>
          </div>
          
          <div className="text-center max-w-sm mt-8">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
              Step 1
            </div>
            <div className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed">
              Login to Apply For Job
            </div>
          </div>
        </div>
        
        {/* Step 2: Apply */}
        <div className="flex flex-col items-center group lg:mt-8">
          {/* Step 2 Image */}
          <div className="relative transform transition-all duration-300 group-hover:scale-105">
            <img
              src='public/images/step2.png'
              alt="Step 2 - Apply Process"
              className='w-64 h-64 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px]  rounded-tl-[50px] rounded-br-[50px] shadow-xl hover:shadow-2xl transition-all duration-300'
            />
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              2
            </div>
          </div>
          
          <div className="text-center max-w-sm mt-8">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
              Step 2
            </div>
            <div className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed">
              Upload Your Resume And Get <span className="font-bold text-blue-600">AI</span> Generated Cover Letter
            </div>
          </div>
        </div>
      </div>
      
      {/* Optional: Add a decorative element */}
      <div className="mt-16 w-full max-w-4xl">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 text-center">
          <div className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            Ready to Get Started?
          </div>
          <div className="text-slate-600">
            Follow these simple steps to begin your job application journey
          </div>
        </div>
      </div>
    </div>
  );
};

export default Working;
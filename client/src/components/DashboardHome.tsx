import React from 'react';

const DashboardHome = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#f7e9d6] via-[#f5e6d3] to-[#f3e3d0] px-4 py-16 md:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#4a6cf7]/20 to-[#6c5ce7]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#fd79a8]/20 to-[#fdcb6e]/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">

        {/* Modern Text Section */}
        <div className="mb-12 text-[#131D4F] px-4 max-w-4xl">
          <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-[#4a6cf7] mb-6 shadow-lg">
            <span className="w-2 h-2 bg-[#4a6cf7] rounded-full mr-2 animate-pulse"></span>
            Dashboard Feature
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Interactive{' '}
            <span className="relative inline-block">
              <span className="text-[#4a6cf7] relative z-10">dashboard</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#4a6cf7]/30" viewBox="0 0 120 12" fill="none">
                <path d="M2 8.5c15-1.5 30-1.5 45 0s30 1.5 45 0 30-1.5 45 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl leading-relaxed text-[#131D4F]/80 font-light">
            Making recruiters' job easy by streamlining
            <br className="hidden sm:block" />
            <span className="font-medium text-[#4a6cf7]">job application management</span> and delivering
            <br className="hidden sm:block" />
            actionable insights at lightning speed
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Smart Filtering</span>
            </div>
            <div className="flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Quick Insights</span>
            </div>
          </div>
        </div>
        
        {/* Modern Card Container for Image */}
        <div className="relative group w-full max-w-[900px] lg:max-w-[1000px]">
          {/* Floating background card */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/10 group-hover:shadow-3xl group-hover:shadow-black/15 transition-all duration-500 transform group-hover:scale-[1.02]"></div>
          
          {/* Image with modern styling */}
          <div className="relative p-4 md:p-6 lg:p-8">
            <img
              src="/images/dashboard.png"
              alt="Dashboard"
              className="w-full h-auto rounded-2xl shadow-xl shadow-black/20 group-hover:shadow-2xl transition-all duration-500"
              style={{ aspectRatio: '16/10' }}
            />
            
            {/* Subtle overlay gradient on image */}
            <div className="absolute inset-4 md:inset-6 lg:inset-8 bg-gradient-to-t from-black/5 to-transparent rounded-2xl pointer-events-none"></div>
          </div>
        </div>

        
        
      </div>
    </section>
  );
};

export default DashboardHome;
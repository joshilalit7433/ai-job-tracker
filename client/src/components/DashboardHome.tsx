import React from 'react';

const DashboardHome = () => {
  return (
    <section className="w-full px-4 py-10 md:py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20">

        {/* Left: Images */}
        <div>
          {/* Show on small devices (mobile only) */}
          <div className="flex gap-4 md:hidden">
            <img
              src="/images/dashboard-mobile1.png"
              alt="Mobile Dashboard 1"
              className="w-1/2 rounded-2xl object-contain"
            />
            <img
              src="/images/dashboard-mobile2.png"
              alt="Mobile Dashboard 2"
              className="w-1/2 rounded-2xl object-contain"
            />
          </div>

          {/* Show on medium and larger devices only */}
          <div className="hidden md:block">
            <img
              src="/images/dashboard.png"
              alt="Desktop Dashboard"
              className="w-[3000px] h-[450px] rounded-2xl "
            />
          </div>
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-[50%] text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 font-handwriting leading-snug">
            interactive{' '}
            <span className="text-red-500 underline decoration-wavy decoration-2">
              dashboard
            </span>
          </h2>

          {/* Desktop: exact line-by-line as per image */}
          <div className="hidden md:block text-lg sm:text-xl text-white leading-relaxed font-handwriting space-y-1">
            <p>which makes recruiters’ job easy</p>
            <p>in managing job applications and</p>
            <p>getting quick insights</p>
          </div>

          {/* Mobile: stacked 3-line format */}
          <div className="md:hidden text-lg sm:text-xl text-white leading-relaxed font-handwriting">
            <p>which makes recruiters job</p>
            <p>easy in managing job applications</p>
            <p>and getting quick insights</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;

import React from 'react';

const DashboardHome = () => {
  return (
    <section className="w-full bg-[#F7F1E8] px-4 py-10 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

        {/* Responsive Image */}
        <img
          src="/images/dashboard.png"
          alt="Dashboard"
          className="w-full max-w-[1250px] h-auto sm:h-[350px] md:h-[450px] rounded-2xl shadow-md "
        />

        {/* Text Below Image */}
        <div className="mt-10 text-[#131D4F] font-handwriting px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
            Interactive{' '}
            <span className="text-[#4a6cf7] underline decoration-wavy decoration-2">
              dashboard
            </span>
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed">
            Making recruiters job easy in managing job applications
            <br className="hidden sm:block" />
            and getting quick insights
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default DashboardHome;

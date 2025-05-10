import React, { useState, useEffect, useCallback } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

export default function Hero() {
  const slides = [
    { url: "./images/slide_1.jpg" },
    { url: "./images/slide_2.jpg" },
    { url: "./images/slide_3.jpg" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      nextSlide();
    }

    if (swipeDistance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="relative group mx-auto max-w-[90%] lg:max-w-[80%] pt-8 mt-16"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide */}
      <div className="relative w-full overflow-hidden rounded-xl">
        <img
          src={slides[currentIndex].url}
          alt={`Slide ${currentIndex}`}
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] object-cover transition-all duration-700 rounded-xl"
        />
      </div>

      {/* Left Arrow */}
      <div
        className="hidden group-hover:block absolute top-1/2 left-5 -translate-y-1/2 text-xl md:text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer z-10"
        onClick={prevSlide}
      >
        <BsChevronCompactLeft size={30} />
      </div>

      {/* Right Arrow */}
      <div
        className="hidden group-hover:block absolute top-1/2 right-5 -translate-y-1/2 text-xl md:text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer z-10"
        onClick={nextSlide}
      >
        <BsChevronCompactRight size={30} />
      </div>

      {/* Dots */}
      <div className="flex justify-center py-4">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`text-xl md:text-2xl cursor-pointer mx-1 ${
              slideIndex === currentIndex
                ? "text-green-700 scale-125"
                : "text-gray-400"
            } transition-transform duration-300 hover:text-green-700 hover:scale-125`}
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}

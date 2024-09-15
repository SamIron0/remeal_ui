'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'Sarah L.', quote: 'Remeal has revolutionized my meal planning. I waste less food and enjoy cooking more!' },
  { id: 2, name: 'Mike T.', quote: 'As a busy professional, Remeal helps me whip up quick meals with whatever I have in the fridge.' },
  { id: 3, name: 'Emily R.', quote: 'The personalized recommendations are spot-on. Remeal knows my taste better than I do!' },
];

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md">
      <div className="text-center">
        <p className="text-lg italic mb-4">"{testimonials[currentIndex].quote}"</p>
        <p className="font-bold">- {testimonials[currentIndex].name}</p>
      </div>
      <button
        onClick={prevTestimonial}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default TestimonialCarousel;

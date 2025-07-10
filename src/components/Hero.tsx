import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const heroImages = [
  {
    url: 'https://images.pexels.com/photos/6492477/pexels-photo-6492477.jpeg',
    title: 'Authentic African Decor',
    subtitle: 'Discover handcrafted treasures that tell stories of rich heritage',
    cta: 'Shop Collection'
  },
  {
    url: 'https://images.pexels.com/photos/6084138/pexels-photo-6084138.jpeg',
    title: 'Traditional Artifacts',
    subtitle: 'Each piece carries the soul of African craftsmanship',
    cta: 'Explore Artifacts'
  },
  {
    url: 'https://images.pexels.com/photos/6207516/pexels-photo-6207516.jpeg',
    title: 'Handwoven Treasures',
    subtitle: 'From baskets to textiles, find the perfect accent for your home',
    cta: 'Browse Woven Items'
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-african-terracotta to-african-gold">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image.url})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4 max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 animate-fade-in">
                {image.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 animate-slide-up opacity-90">
                {image.subtitle}
              </p>
              <button className="bg-african-gold hover:bg-african-gold-dark text-african-brown font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center mx-auto space-x-2 animate-bounce-gentle">
                <ShoppingBag className="w-5 h-5" />
                <span>{image.cta}</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-african-gold' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function HeroCarousel() {
  const navigate = useNavigate();

  // Données pour chaque slide avec titre, description et CTA
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=95",
      title: "Découvrez Votre Style Unique",
      description: "Collection exclusive de mode, beauté et accessoires premium",
      cta: "Parcourir la collection",
      path: "/products"
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=95",
      title: "Nouveautés Printemps 2026",
      description: "Les dernières tendances pour sublimer votre garde-robe",
      cta: "Voir les nouveautés",
      path: "/products/new"
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=95",
      title: "Accessoires Premium",
      description: "Des pièces uniques pour parfaire chaque look",
      cta: "Découvrir",
      path: "/products/bijoux"
    },
    {
      image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1920&q=95",
      title: "Beauté & Bien-être",
      description: "Prenez soin de vous avec nos produits sélectionnés",
      cta: "Explorer",
      path: "/products"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      handleSlideChange((currentIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay, currentIndex, slides.length]);

  const handleSlideChange = (newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index) => {
    handleSlideChange(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 8000);
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    handleSlideChange(newIndex);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 8000);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    handleSlideChange(newIndex);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 8000);
  };

  return (
    <div className="relative w-full h-screen max-h-[600px] md:max-h-[700px] overflow-hidden bg-gray-900">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          >
            {/* Image avec meilleure résolution */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
              style={{
                imageRendering: "crisp-edges",
                WebkitFontSmoothing: "antialiased"
              }}
            />
            
            {/* Overlay Gradient pour meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/50" />
            
            {/* Contenu texte pour chaque slide */}
            <div className="absolute inset-0 flex items-center justify-start z-20">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <div className="space-y-4 md:space-y-6 max-w-2xl">
                  <h1
                    className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight transition-all duration-700 transform ${
                      index === currentIndex
                        ? "opacity-100 translate-y-0 delay-100"
                        : "opacity-0 translate-y-12"
                    }`}
                  >
                    {slide.title}
                  </h1>
                  
                  <p
                    className={`text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed transition-all duration-700 transform ${
                      index === currentIndex
                        ? "opacity-100 translate-y-0 delay-200"
                        : "opacity-0 translate-y-12"
                    }`}
                  >
                    {slide.description}
                  </p>
                  
                  <div
                    className={`transition-all duration-700 transform ${
                      index === currentIndex
                        ? "opacity-100 translate-y-0 delay-300"
                        : "opacity-0 translate-y-12"
                    }`}
                  >
                    <button
                      onClick={() => navigate(slide.path)}
                      className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-base md:text-lg rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    >
                      {slide.cta}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 group disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Slide précédent"
      >
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-red-600 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 transform group-hover:scale-110 shadow-lg">
          <ChevronLeft size={24} className="text-white" />
        </div>
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 group disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Slide suivant"
      >
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-red-600 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 transform group-hover:scale-110 shadow-lg">
          <ChevronRight size={24} className="text-white" />
        </div>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 rounded-full shadow-md ${
              index === currentIndex
                ? "bg-red-600 w-8 h-3 md:w-10 md:h-3"
                : "bg-white/50 hover:bg-white/80 w-3 h-3"
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div
          className="h-full bg-red-600 transition-all duration-300 ease-linear"
          style={{
            width: isAutoplay ? `${((currentIndex + 1) / slides.length) * 100}%` : '0%'
          }}
        />
      </div>
    </div>
  );
}

export default HeroCarousel;
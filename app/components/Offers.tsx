'use client';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Offer {
  id: number;
  type: string;
  color: string;
  image: string;
}

const Offers: React.FC<{ onOpenPopup: () => void }> = ({ onOpenPopup }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [items, setItems] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        if (!response.ok) throw new Error('Failed to fetch offers');
        const data: Offer[] = await response.json();
        setItems(data);
      } catch (err) {
        setError('Ошибка загрузки предложений');
        console.error(err);
      }
    };
    fetchOffers();
  }, []);

  // Размеры для карточек:
  const mobileCardWidth = 320; // Можно подстроить под нужный размер экрана
  const desktopCardWidth = 380;

  const mobileSettings = {
    infinite: items.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '40px', // Отступы слева и справа
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    speed: 500,
    cssEase: 'linear',
    arrows: false,
    adaptiveHeight: false,
  };

  const desktopSettings = {
    infinite: items.length > 3,
    slidesToShow: items.length >= 3 ? 3 : items.length,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: '0px',
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    speed: 500,
    cssEase: 'linear',
    arrows: false,
    adaptiveHeight: false,
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;

  const renderCard = (item: Offer, width: number) => {
    const height = (width * 5) / 4; // высота по пропорции 4:5

    return (
      <div key={item.id} className="px-2"> {/* Отступы между карточками */}
        <div
          className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-in-out flex flex-col justify-end p-4 w-full max-w-[380px]"
          style={{ height }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-0" />

          {/* Image */}
          <Image
            src={item.image}
            alt={item.type}
            width={width}
            height={height}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Label */}
          <span
            className={`absolute top-3 left-3 ${item.color} text-white text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full z-10 backdrop-blur bg-black/30 border border-white/10`}
          >
            {item.type}
          </span>

          {/* Button */}
          <button
            className="bg-white/10 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition relative z-10 mt-auto"
            onClick={onOpenPopup}
          >
            Подробнее →
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="px-6 py-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-light mb-6">АКТУАЛЬНЫЕ ПРЕДЛОЖЕНИЯ</h2>

      <div className="mt-6 w-full">
        {isMobile ? (
          <div className="overflow-visible">
            <Slider {...mobileSettings}>
              {items.map((item) => renderCard(item, mobileCardWidth))}
            </Slider>
          </div>
        ) : (
          <Slider {...desktopSettings}>
            {items.map((item) => renderCard(item, desktopCardWidth))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default Offers;

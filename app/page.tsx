// app/page.tsx
'use client';
import React, { useState } from 'react';
import Header from '@/app/components/Header';
import MobileMenu from '@/app/components/MobileMenu';
import Offers from '@/app/components/Offers';
import Events from '@/app/components/Events';
import Popup from '@/app/components/Popup';
import SKKForm from '@/app/components/SKKForm';  // <-- наш новый компонент

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOffersPopupOpen, setIsOffersPopupOpen] = useState(false);
  const [isSKKPopupOpen, setIsSKKPopupOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleOffersPopup = () => setIsOffersPopupOpen(!isOffersPopupOpen);
  const toggleSKKPopup = () => setIsSKKPopupOpen(!isSKKPopupOpen);

  return (
    <>
      <Header onBurgerClick={toggleMenu} />
      <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />

      <Offers onOpenPopup={toggleOffersPopup} />
      <Events />

      {/* Блок с «Связаться с службой качества» */}
      <section className="px-6 pb-12 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-light mb-6">СЛУЖБА КАЧЕСТВА</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-800 hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
          >
            <button
              onClick={toggleSKKPopup}
              className="bg-red-800 text-white font-bold px-6 py-3 rounded-2xl hover:bg-red-700 transition-colors"
            >
              Связаться с службой качества
            </button>
          </div>
        </div>
      </section>
      {/* Попап для акций */}
      <Popup isOpen={isOffersPopupOpen} onClose={toggleOffersPopup}>
        {/* сюда Popup рендерит свой контент */}
      </Popup>

      {/* Попап для СКК */}
      <Popup isOpen={isSKKPopupOpen} onClose={toggleSKKPopup}>
        <SKKForm onSuccess={toggleSKKPopup} />
      </Popup>
    </>
  );
}

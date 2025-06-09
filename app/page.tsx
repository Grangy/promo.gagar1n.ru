'use client';
import React, { useState } from 'react';
import Header from '@/app/components/Header';
import MobileMenu from '@/app/components/MobileMenu';
import Offers from '@/app/components/Offers';
import Events from '@/app/components/Events';
import Popup from '@/app/components/Popup';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <>
      <Header onBurgerClick={toggleMenu} />
      <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
      <Offers onOpenPopup={togglePopup} />
      <Events />
      <Popup isOpen={isPopupOpen} onClose={togglePopup} />
    </>
  );
}
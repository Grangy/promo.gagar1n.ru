import React from 'react';
import Image from 'next/image';

const Header: React.FC<{ onBurgerClick: () => void }> = ({ onBurgerClick }) => {
  return (
    <header className="bg-gray-900 px-6 py-4 flex items-center justify-between rounded-b-xl max-w-screen-xl mx-auto">
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Логотип"
          width={40}
          height={40}
          className="w-auto h-10 object-contain"
          priority
        />
      </div>
      <nav className="hidden md:flex space-x-6 text-sm font-semibold tracking-wide">
        <a href="https://grelkaspa.ru" className="hover:text-red-400 transition">GRELKA SPA</a>
        <a href="https://gunior.ru" className="hover:text-red-400 transition">GUN1OR</a>
        <a href="https://new.gagar1n.ru" className="hover:text-red-400 transition">GAGAR1N</a>
      </nav>
      <button id="burger" className="md:hidden text-white focus:outline-none" onClick={onBurgerClick}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
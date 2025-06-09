import React, { useEffect, useRef } from 'react';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && e.target === wrapperRef.current) {
        onClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={wrapperRef}
      id="mobileMenuWrapper"
      className={`md:hidden fixed inset-0 z-40 ${isOpen ? 'flex' : 'hidden'} bg-black/50 items-center justify-center`}
    >
      <div
        id="mobileMenu"
        className={`bg-gray-900 w-11/12 max-w-sm px-8 py-10 space-y-6 text-center rounded-2xl transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        } transition-transform duration-300 relative`}
      >
        <button
          id="closeMenu"
          className="absolute top-4 right-4 text-white focus:outline-none"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <a href="#" className="block text-lg font-semibold hover:text-red-400" onClick={onClose}>
          GRELKA SPA
        </a>
        <a href="#" className="block text-lg font-semibold hover:text-red-400" onClick={onClose}>
          GUN1OR
        </a>
        <a href="#" className="block text-lg font-semibold hover:text-red-400" onClick={onClose}>
          GAGAR1N
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;
import React, { useEffect, useRef } from 'react';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const links = [
    { label: 'GRELKA SPA', href: 'https://grelkaspa.ru' },
    { label: 'GUN1OR', href: 'https://gunior.ru' },
    { label: 'GAGAR1N', href: 'https://new.gagar1n.ru' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && e.target === wrapperRef.current) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose, isOpen]);

  return (
    <div
      ref={wrapperRef}
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      } bg-black/50 backdrop-blur-sm flex items-center justify-center md:hidden`}
      aria-hidden={!isOpen}
    >
      <div
        className={`bg-gray-900 w-11/12 max-w-sm px-8 py-10 space-y-6 text-center rounded-2xl shadow-2xl transform transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-10 scale-95 opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Close menu"
          className="absolute top-4 right-4 text-white hover:text-red-400 focus:outline-none transition-colors duration-200"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {links.map(({ label, href }, index) => (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="block text-lg font-semibold text-white/90 tracking-wide transition-all duration-200 hover:text-red-400 hover:underline focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-white/10 py-4 mt-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-secondary-400 text-sm">
            &copy; {currentYear} ShortsTrackerTeam. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
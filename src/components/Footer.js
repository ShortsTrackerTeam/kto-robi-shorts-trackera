import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-white/10 py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-secondary-400 text-sm">
              &copy; {currentYear} <span className="text-accent">ShortsTrackerTeam</span>. Wszystkie prawa zastrzeżone.
            </p>
          </div>
          
          <div className="text-xs text-secondary-500">
            ShortsTracker - wewnętrzne narzędzie analityczne
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';

const Header = ({ onRefresh, lastUpdated }) => {
  const formattedDate = lastUpdated ? lastUpdated.toLocaleString() : 'Brak danych';

  return (
    <header className="bg-background border-b border-white/10 py-4 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Kto robi <span className="text-accent">ShortsTrackera</span>?
            </h1>
            <p className="text-secondary-300 text-sm">
              Statystyki projektu ShortsTracker z GitHub i Jira
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            {lastUpdated && (
              <div className="text-sm text-secondary-300 mr-4 mb-2 md:mb-0">
                Ostatnia aktualizacja: {formattedDate}
              </div>
            )}
            
            <button 
              onClick={onRefresh}
              className="px-4 py-2 rounded border border-accent text-accent hover:bg-accent hover:text-background"
            >
              Odśwież
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
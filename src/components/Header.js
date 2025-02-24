import React from 'react';

const Header = ({ onRefresh, lastUpdated }) => {
  // Formatowanie daty
  const formattedDate = lastUpdated 
    ? lastUpdated.toLocaleString('pl-PL', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : '';

  return (
    <header className="bg-background border-b border-white/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Kto robi <span className="text-accent">ShortsTrackera</span>?
            </h1>
            <p className="text-secondary-300 text-sm mt-1">
              Transparentne statystyki projektu - sprawdź, kto i ile zrobił commitów w repozytorium i zadań w Jira
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            {lastUpdated && (
              <div className="text-sm text-secondary-300 mb-2">
                Aktualizacja: {formattedDate}
              </div>
            )}
            
            <button 
              onClick={onRefresh}
              className="px-4 py-2 rounded border border-accent text-accent hover:bg-accent hover:text-background transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Odśwież
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
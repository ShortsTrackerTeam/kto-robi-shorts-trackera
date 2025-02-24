import React from 'react';

const GitHubStats = ({ data }) => {
  if (!data) return null;

  const { totalCommits, lastCommitDate, authorStats } = data;
  
  // Formatowanie daty
  const formattedDate = lastCommitDate 
    ? new Date(lastCommitDate).toLocaleString('pl-PL', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : 'Brak danych';

  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Statystyki GitHub</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
          <p className="text-sm text-secondary-300">Łączna liczba commitów</p>
          <p className="text-2xl font-bold">{totalCommits}</p>
          <p className="text-xs text-secondary-400 mt-1">nie uwzględnia merge'y oraz commitów botów</p>
        </div>
        
        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
          <p className="text-sm text-secondary-300">Ostatni commit</p>
          <p className="text-xl font-bold">{formattedDate}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Statystyki autorów:</h3>
        <div className="bg-white bg-opacity-5 rounded-lg">
          {authorStats && authorStats.map((author, index) => (
            <div 
              key={index} 
              className="p-3 border-b border-white/10 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{author.author}</span>
                <span className="text-accent font-bold"> {author.percentage}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${author.roundedPercentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
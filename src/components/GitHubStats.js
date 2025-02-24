import React from 'react';

const GitHubStats = ({ data }) => {
  if (!data) return null;

  const { totalCommits, lastCommitDate, authorStats } = data;
  const formattedDate = lastCommitDate ? new Date(lastCommitDate).toLocaleString() : 'Brak danych';

  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Statystyki GitHub</h2>
      
      <div className="mb-4">
        <p className="mb-2">Łączna liczba commitów: <span className="font-bold">{totalCommits}</span></p>
        <p>Ostatni commit: <span className="font-bold">{formattedDate}</span></p>
      </div>
      
      <h3 className="text-lg font-medium mb-2">Statystyki autorów:</h3>
      <ul className="space-y-2">
        {authorStats && authorStats.map((author, index) => (
          <li key={index} className="border-b border-white/10 pb-2">
            <div className="flex justify-between">
              <span>{author.author}</span>
              <span className="font-bold">{author.count} ({author.percentage}%)</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mt-1">
              <div 
                className="bg-accent h-2 rounded-full" 
                style={{ width: `${author.percentage}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GitHubStats;
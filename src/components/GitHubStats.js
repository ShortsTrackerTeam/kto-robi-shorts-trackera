import React from 'react';
import StatCard from './StatCard';
import StatsTable from './StatsTable';
import CommitChart from './CommitChart';
import { formatTimeAgo } from '../utils/formatters';

const GitHubStats = ({ data }) => {
  if (!data) return null;

  const { totalCommits, lastCommitDate, authorStats } = data;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-accent">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0 1 12 2v5h4a1 1 0 0 1 .82 1.573l-7 10A1 1 0 0 1 8 18v-5H4a1 1 0 0 1-.82-1.573l7-10a1 1 0 0 1 1.12-.38Z" clipRule="evenodd" />
        </svg>
        Statystyki GitHub
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          title="Łączna liczba commitów" 
          value={totalCommits}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        />
        
        <StatCard 
          title="Ostatni commit" 
          value={formatTimeAgo(lastCommitDate)}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
      
      <CommitChart 
        data={authorStats} 
        title="Rozkład commitów według autorów"
      />
      
      <StatsTable 
        data={authorStats} 
        nameKey="author" 
        countKey="count" 
        percentKey="percentage"
        title="Szczegółowe statystyki commitów" 
      />
    </div>
  );
};

export default GitHubStats;
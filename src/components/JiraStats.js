import React from 'react';
import StatCard from './StatCard';
import StatsTable from './StatsTable';
import TaskChart from './TaskChart';
import { formatTimeAgo } from '../utils/formatters';

const JiraStats = ({ data }) => {
  if (!data) return null;

  const { totalTasks, lastUpdatedTask, assigneeStats } = data;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-accent">
          <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        </svg>
        Statystyki Jira
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          title="Łączna liczba zadań" 
          value={totalTasks}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        
        <StatCard 
          title="Ostatnia aktualizacja zadania" 
          value={lastUpdatedTask ? formatTimeAgo(lastUpdatedTask.updated) : 'Brak danych'}
          subtitle={lastUpdatedTask ? `Zadanie ${lastUpdatedTask.key} przez ${lastUpdatedTask.assignee}` : ''}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        />
      </div>
      
      <TaskChart 
        data={assigneeStats} 
        title="Rozkład zadań według osób"
      />
      
      <StatsTable 
        data={assigneeStats} 
        nameKey="assignee" 
        countKey="count" 
        percentKey="percentage"
        title="Szczegółowe statystyki zadań" 
      />
    </div>
  );
};

export default JiraStats;
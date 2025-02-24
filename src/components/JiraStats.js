import React from 'react';

const JiraStats = ({ data }) => {
  if (!data) return null;

  const { totalTasks, lastUpdatedTask, assigneeStats } = data;
  const formattedDate = lastUpdatedTask?.updated 
    ? new Date(lastUpdatedTask.updated).toLocaleString() 
    : 'Brak danych';

  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Statystyki Jira</h2>
      
      <div className="mb-4">
        <p className="mb-2">Łączna liczba zadań: <span className="font-bold">{totalTasks}</span></p>
        <p>Ostatnia aktualizacja zadania: <span className="font-bold">{formattedDate}</span></p>
        {lastUpdatedTask && (
          <p className="text-sm text-secondary-300">
            Zadanie {lastUpdatedTask.key} przez {lastUpdatedTask.assignee}
          </p>
        )}
      </div>
      
      <h3 className="text-lg font-medium mb-2">Statystyki zadań:</h3>
      <ul className="space-y-2">
        {assigneeStats && assigneeStats.map((assignee, index) => (
          <li key={index} className="border-b border-white/10 pb-2">
            <div className="flex justify-between">
              <span>{assignee.assignee}</span>
              <span className="font-bold">{assignee.count} ({assignee.percentage}%)</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mt-1">
              <div 
                className="bg-accent h-2 rounded-full" 
                style={{ width: `${assignee.percentage}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JiraStats;
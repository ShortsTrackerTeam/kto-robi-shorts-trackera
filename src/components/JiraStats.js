import React from 'react';

const JiraStats = ({ data }) => {
  if (!data) return null;

  const { totalTasks, lastUpdatedTask, assigneeStats } = data;
  
  // Formatowanie daty
  const formattedDate = lastUpdatedTask?.updated 
    ? new Date(lastUpdatedTask.updated).toLocaleString('pl-PL', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : 'Brak danych';

  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Statystyki Jira</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
          <p className="text-sm text-secondary-300">Łączna liczba zadań</p>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        
        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
          <p className="text-sm text-secondary-300">Ostatnia aktualizacja zadania</p>
          <p className="text-xl font-bold">{formattedDate}</p>
          {lastUpdatedTask && (
            <p className="text-sm text-secondary-300 mt-1">
              Zadanie {lastUpdatedTask.key} przez {lastUpdatedTask.assignee}
            </p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Statystyki zadań:</h3>
        <div className="bg-white bg-opacity-5 rounded-lg">
          {assigneeStats && assigneeStats.map((assignee, index) => (
            <div 
              key={index} 
              className="p-3 border-b border-white/10 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{assignee.assignee}</span>
                <span className="text-accent font-bold"> {assignee.percentage}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${assignee.roundedPercentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JiraStats;
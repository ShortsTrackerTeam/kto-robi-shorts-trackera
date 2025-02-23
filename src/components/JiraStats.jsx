// src/components/JiraStats.jsx
import React, { useEffect, useState } from 'react';
import { componentClasses } from '../styles/theme';
import { jiraService } from '../services/api';

const JiraStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const tasks = await jiraService.getCompletedTasks();
      const tasksByUser = tasks.reduce((acc, task) => {
        const assignee = task.fields.assignee?.displayName || 'Unassigned';
        acc[assignee] = (acc[assignee] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(tasksByUser).reduce((a, b) => a + b, 0);
      const statsArray = Object.entries(tasksByUser).map(([name, count]) => ({
        name,
        count,
        percentage: ((count / total) * 100).toFixed(1)
      }));

      setStats(statsArray);
    };

    fetchStats();
  }, []);

  return (
    <div className={componentClasses.card}>
      <h2 className={componentClasses.title}>Completed Tasks</h2>
      <div className="space-y-4">
        {stats.map(({ name, count, percentage }) => (
          <div key={name} className={componentClasses.flexBetween}>
            <div>
              <div className="text-white font-medium">{name}</div>
              <div className="text-sm text-gray-400">{count} tasks</div>
            </div>
            <div className={`${componentClasses.accentText} font-bold`}>
              {percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JiraStats;
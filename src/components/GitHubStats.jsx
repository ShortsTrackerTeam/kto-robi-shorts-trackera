// src/components/GitHubStats.jsx
import React, { useEffect, useState } from 'react';
import { componentClasses } from '../styles/theme';
import { githubService } from '../services/api';

const GitHubStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const commits = await githubService.getCommits();
      const commitsByAuthor = commits.reduce((acc, commit) => {
        const author = commit.commit.author.name;
        acc[author] = (acc[author] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(commitsByAuthor).reduce((a, b) => a + b, 0);
      const statsArray = Object.entries(commitsByAuthor).map(([name, count]) => ({
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
      <h2 className={componentClasses.title}>Commit Statistics</h2>
      <div className="space-y-4">
        {stats.map(({ name, count, percentage }) => (
          <div key={name} className={componentClasses.flexBetween}>
            <div>
              <div className="text-white font-medium">{name}</div>
              <div className="text-sm text-gray-400">{count} commits</div>
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

export default GitHubStats;
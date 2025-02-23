// src/components/LastCommits.jsx
import React, { useEffect, useState } from 'react';
import { componentClasses } from '../styles/theme';
import { githubService } from '../services/api';

const LastCommits = () => {
  const [lastCommits, setLastCommits] = useState([]);

  useEffect(() => {
    const fetchLastCommits = async () => {
      const commits = await githubService.getLastCommits();
      const uniqueAuthors = {};
      
      commits.forEach(commit => {
        const author = commit.commit.author.name;
        if (!uniqueAuthors[author]) {
          uniqueAuthors[author] = {
            name: author,
            date: new Date(commit.commit.author.date),
            message: commit.commit.message
          };
        }
      });

      setLastCommits(Object.values(uniqueAuthors));
    };

    fetchLastCommits();
  }, []);

  return (
    <div className={componentClasses.card}>
      <h2 className={componentClasses.title}>Last Commits by Author</h2>
      <div className="space-y-4">
        {lastCommits.map(({ name, date, message }) => (
          <div key={name} className="border-b border-gray-700 pb-3 last:border-0">
            <div className="text-white font-medium">{name}</div>
            <div className="text-sm text-gray-400">
              {date.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-300 mt-1 truncate">
              {message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastCommits;
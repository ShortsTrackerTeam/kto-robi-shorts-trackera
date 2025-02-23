// src/App.jsx
import React from 'react';
import { layoutClasses } from './styles/theme';
import JiraStats from './components/JiraStats.jsx';
import GitHubStats from './components/GitHubStats.jsx';
import LastCommits from './components/LastCommits.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-[#161440]">
      <div className={layoutClasses.container}>
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Repository Statistics
        </h1>
        
        <div className={layoutClasses.grid}>
          <JiraStats />
          <GitHubStats />
          <LastCommits />
        </div>
      </div>
    </div>
  );
};

export default App;
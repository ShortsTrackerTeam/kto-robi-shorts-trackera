import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { prepareChartData } from '../utils/formatters';
import { theme, chartOptions } from '../styles/theme';

// Rejestracja niezbędnych komponentów Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CommitChart = ({ data, title }) => {
  const chartData = prepareChartData(
    data,
    'author',
    'percentage',
    theme.chartColors.github
  );

  return (
    <div className="glass-effect p-4 rounded-lg border border-white/10 shadow-md">
      <h3 className="text-primary font-medium mb-4">{title}</h3>
      <div className="h-64 w-full relative">
        <Pie data={chartData} options={chartOptions} />
        
        {/* Efekt gradientu w tle wykresu */}
        <div className="absolute inset-0 -z-10 bg-accent/5 rounded-lg" style={{
          background: 'radial-gradient(circle at center, rgba(245, 189, 2, 0.1) 0%, rgba(25, 25, 112, 0) 70%)'
        }}></div>
      </div>
    </div>
  );
};

export default CommitChart;
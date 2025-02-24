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
    <div className="glass-effect p-4 rounded-lg">
      <h3 className="text-primary font-medium mb-4">{title}</h3>
      <div className="h-64 w-full">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CommitChart;
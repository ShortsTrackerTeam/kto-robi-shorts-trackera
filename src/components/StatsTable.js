import React from 'react';
import { formatPercentage } from '../utils/formatters';

const StatsTable = ({ data, nameKey, countKey, percentKey, title }) => {
  if (!data || !data.length) {
    return (
      <div className="glass-effect p-4 rounded-lg">
        <h3 className="text-primary font-medium mb-2">{title}</h3>
        <p className="text-secondary-300">Brak danych do wyświetlenia</p>
      </div>
    );
  }

  return (
    <div className="glass-effect p-4 rounded-lg overflow-hidden">
      <h3 className="text-primary font-medium mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-2 text-secondary-200 font-medium">Osoba</th>
              <th className="text-center py-2 px-2 text-secondary-200 font-medium">Ilość</th>
              <th className="text-center py-2 px-2 text-secondary-200 font-medium">Udział</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-2 text-primary">{item[nameKey]}</td>
                <td className="py-3 px-2 text-center text-primary">{item[countKey]}</td>
                <td className="py-3 px-2 text-center text-primary">{formatPercentage(item[percentKey])}</td>
                <td className="py-3 px-2">
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${item[percentKey]}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;
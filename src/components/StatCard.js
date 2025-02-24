import React from 'react';

const StatCard = ({ title, value, icon, subtitle, className }) => {
  return (
    <div className={`glass-effect p-5 rounded-lg border border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-secondary-200 font-medium text-sm">{title}</h3>
          <p className="text-primary text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-secondary-300 text-xs mt-1">{subtitle}</p>}
        </div>
        
        {icon && (
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            {icon}
          </div>
        )}
      </div>
      
      {/* Dekoracyjny element */}
      <div className="w-16 h-1 bg-accent/30 rounded-full mt-4"></div>
    </div>
  );
};

export default StatCard;
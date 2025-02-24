import React from 'react';

const StatCard = ({ title, value, icon, subtitle, className }) => {
  return (
    <div className={`glass-effect p-5 rounded-lg ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-secondary-200 font-medium text-sm">{title}</h3>
          <p className="text-primary text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-secondary-300 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="text-accent">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growth?: string;
  isPositive?: boolean;
  subtext?: string;
  onClick?: () => void;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  growth,
  isPositive = true,
  subtext,
  onClick,
  color = 'primary'
}) => {
  const iconColors = {
    primary: 'bg-[#EFF2F7] text-[#3C50E0] dark:bg-[#1E293B] dark:text-[#80CAEE]',
    success: 'bg-[#E1F9F0] text-[#10B981] dark:bg-[#064E3B]/40 dark:text-[#34D399]',
    warning: 'bg-[#FEF6E6] text-[#FFA70B] dark:bg-[#78350F]/40 dark:text-[#FBBF24]',
    danger: 'bg-[#FEEBEB] text-[#DC2626] dark:bg-[#7F1D1D]/40 dark:text-[#F87171]',
    info: 'bg-[#EFF6FF] text-[#0284C7] dark:bg-[#0C4A6E]/40 dark:text-[#38BDF8]'
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-[#2E3A47] dark:bg-[#24303F] transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#3C50E0] hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full p-2.5 ${iconColors[color]}`}>
          {icon}
        </div>
        {growth && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
            {growth}
            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold text-[#1C2434] dark:text-white">
            {value}
          </h4>
          <span className="text-xs font-medium text-[#64748B] dark:text-[#8A99AD] uppercase tracking-wider block mt-1">
            {title}
          </span>
        </div>
      </div>
      {subtext && (
        <p className="mt-2 text-[11px] text-[#94A3B8] dark:text-[#64748B]">
          {subtext}
        </p>
      )}
    </div>
  );
};

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  className = '' 
}) => {
  const variantStyles = {
    primary: 'bg-[#EBF5FF] text-[#3C50E0] border border-[#C3D9FF] dark:bg-[#1E293B] dark:text-[#80CAEE] dark:border-[#2E3A47]',
    success: 'bg-[#E1F9F0] text-[#10B981] border border-[#A7F3D0] dark:bg-[#064E3B]/30 dark:text-[#34D399] dark:border-[#065F46]',
    warning: 'bg-[#FEF6E6] text-[#D97706] border border-[#FDE68A] dark:bg-[#78350F]/30 dark:text-[#FBBF24] dark:border-[#92400E]',
    danger: 'bg-[#FEEBEB] text-[#DC2626] border border-[#FECACA] dark:bg-[#7F1D1D]/30 dark:text-[#F87171] dark:border-[#991B1B]',
    info: 'bg-[#EFF6FF] text-[#0284C7] border border-[#BAE6FD] dark:bg-[#0C4A6E]/30 dark:text-[#38BDF8] dark:border-[#0369A1]',
    neutral: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] dark:bg-[#1E293B] dark:text-[#94A3B8] dark:border-[#334155]'
  };

  const sizeStyles = {
    sm: 'py-0.5 px-2 text-[11px] font-medium leading-none rounded',
    md: 'py-1 px-2.5 text-xs font-semibold rounded'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};

export function getListingStatusBadge(status: string) {
  switch (status) {
    case 'Ready to Market':
      return <Badge variant="primary">Ready to Market</Badge>;
    case 'Published':
      return <Badge variant="success">Published</Badge>;
    case 'Reserved':
      return <Badge variant="warning">Reserved</Badge>;
    case 'Sold':
      return <Badge variant="danger">Sold</Badge>;
    case 'Owner Contacted':
      return <Badge variant="info">Owner Contacted</Badge>;
    case 'Agreement Pending':
      return <Badge variant="warning">Agreement Pending</Badge>;
    case 'Prospect':
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export function getLeadTemperatureBadge(temp: string) {
  switch (temp) {
    case 'Hot':
      return <Badge variant="danger">🔥 Hot</Badge>;
    case 'Warm':
      return <Badge variant="warning">⚡ Warm</Badge>;
    case 'Cold':
    default:
      return <Badge variant="neutral">❄️ Cold</Badge>;
  }
}

export function getPipelineStageBadge(stage: string) {
  switch (stage) {
    case 'New':
      return <Badge variant="neutral">New</Badge>;
    case 'Contacted':
      return <Badge variant="info">Contacted</Badge>;
    case 'Qualified':
      return <Badge variant="primary">Qualified</Badge>;
    case 'Property Suggested':
      return <Badge variant="info">Property Suggested</Badge>;
    case 'Site Visit':
      return <Badge variant="warning">Site Visit</Badge>;
    case 'Negotiation':
      return <Badge variant="warning">Negotiation</Badge>;
    case 'Booking':
      return <Badge variant="primary">Booking</Badge>;
    case 'Closed Won':
      return <Badge variant="success">Closed Won</Badge>;
    case 'Closed Lost':
      return <Badge variant="danger">Closed Lost</Badge>;
    default:
      return <Badge variant="neutral">{stage}</Badge>;
  }
}

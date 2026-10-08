import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  pageName: string;
  parentName?: string;
  parentPath?: string;
  onNavigate?: (path: string) => void;
  actions?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  pageName,
  parentName,
  parentPath,
  onNavigate,
  actions
}) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[#1C2434] dark:text-white">
          {pageName}
        </h2>
        <nav className="mt-1">
          <ol className="flex items-center gap-2 text-xs font-medium text-[#64748B] dark:text-[#8A99AD]">
            <li>
              <button 
                onClick={() => onNavigate && onNavigate('/dashboard')}
                className="flex items-center gap-1 hover:text-[#3C50E0] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            </li>
            {parentName && (
              <>
                <ChevronRight className="w-3 h-3 text-[#CBD5E1] dark:text-[#475569]" />
                <li>
                  <button 
                    onClick={() => parentPath && onNavigate && onNavigate(parentPath)}
                    className="hover:text-[#3C50E0] transition-colors"
                  >
                    {parentName}
                  </button>
                </li>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-[#CBD5E1] dark:text-[#475569]" />
            <li className="text-[#3C50E0] font-semibold dark:text-[#80CAEE]">
              {pageName}
            </li>
          </ol>
        </nav>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
};

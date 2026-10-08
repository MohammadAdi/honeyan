import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-[#24303F] rounded-lg shadow-2xl border border-[#E2E8F0] dark:border-[#2E3A47] overflow-hidden max-h-[90vh] flex flex-col z-10 transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#2E3A47] bg-white dark:bg-[#24303F]">
          <div>
            <h3 className="text-lg font-bold text-[#1C2434] dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#64748B] dark:text-[#8A99AD] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#1C2434] dark:text-[#8A99AD] dark:hover:text-white rounded hover:bg-[#F1F5F9] dark:hover:bg-[#2E3A47] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto grow">
          {children}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border bg-white dark:bg-[#1A1D24] border-neutral-200 dark:border-neutral-800 shadow-lg text-sm transition-all"
            role="status"
          >
            {isError ? (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            ) : isInfo ? (
              <Info className="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#D95338] dark:text-[#E26349] shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-neutral-800 dark:text-neutral-200 leading-snug">
              {toast.message}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

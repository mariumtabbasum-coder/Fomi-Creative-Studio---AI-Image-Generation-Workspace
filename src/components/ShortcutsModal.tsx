import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '⌘ / Ctrl + Enter', desc: 'Generate images from current prompt' },
  { key: 'Esc', desc: 'Close dialogs, lightbox modal, or menus' },
  { key: '← / →', desc: 'Navigate between images in lightbox preview' },
  { key: '⌘ / Ctrl + /', desc: 'Open keyboard shortcuts sheet' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#15171C] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-[#D95338]" />
            <h2 id="shortcuts-title" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Studio Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 text-xs"
            >
              <span className="text-neutral-600 dark:text-neutral-400">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

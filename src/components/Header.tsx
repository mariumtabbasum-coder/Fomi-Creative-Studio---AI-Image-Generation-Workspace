import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Bookmark,
  FileText,
  HelpCircle,
  RotateCcw,
  Menu,
  X,
  ExternalLink,
  Heart,
  Palette,
} from 'lucide-react';
import { WorkspaceTab } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  totalSavedCount: number;
  favoritesCount: number;
  onOpenShortcuts: () => void;
  onResetDemoData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  totalSavedCount,
  favoritesCount,
  onOpenShortcuts,
  onResetDemoData,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click-outside listener for profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLight = theme === 'light';
  const themeToggleLabel = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF7F2]/95 dark:bg-[#0F1115]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('image-workspace')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95338] rounded-md transition-opacity hover:opacity-90"
            aria-label="Fomi Creative Studio Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D95338] flex items-center justify-center text-white shadow-sm font-semibold text-base shrink-0">
              F
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 whitespace-nowrap tracking-tight leading-tight">
                Fomi Studio
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono tracking-wider uppercase hidden sm:block">
                Assessment Part B
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Responsive) */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium"
          aria-label="Workspace Navigation"
        >
          {/* Image Studio */}
          <button
            onClick={() => onSelectTab('image-workspace')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'image-workspace'
                ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D95338] shrink-0" />
            <span>Image Studio</span>
          </button>

          {/* Saved Works */}
          <button
            onClick={() => onSelectTab('saved')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50'
            }`}
          >
            <Bookmark className="w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span>Saved Works</span>
            <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono text-[11px]">
              {totalSavedCount}
            </span>
            {favoritesCount > 0 && (
              <span
                className="hidden xl:inline-flex items-center gap-0.5 text-[10px] text-rose-600 dark:text-rose-400 ml-0.5"
                title={`${favoritesCount} favorited`}
              >
                <Heart className="w-2.5 h-2.5 fill-current" />
                <span>{favoritesCount}</span>
              </span>
            )}
          </button>

          {/* Content Generator (Part A) */}
          <button
            onClick={() => onSelectTab('content-workspace')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'content-workspace'
                ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="hidden lg:inline">Content Generator (Part A)</span>
            <span className="lg:hidden">Content (Part A)</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Theme Toggle & Profile & Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Shortcuts Quick Button (Desktop) */}
          <button
            onClick={onOpenShortcuts}
            className="hidden sm:flex p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            title="Keyboard Shortcuts (⌘/)"
            aria-label="Open keyboard shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 transition-all focus-visible:ring-2 focus-visible:ring-[#D95338]"
            aria-label={themeToggleLabel}
            title={themeToggleLabel}
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-neutral-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95338]"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label="User account menu"
            >
              <div className="w-6 h-6 rounded-full bg-[#23201D] dark:bg-neutral-200 text-white dark:text-[#23201D] flex items-center justify-center text-xs font-semibold">
                M
              </div>
              <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 hidden sm:inline">
                Studio
              </span>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181A1F] shadow-xl p-2 z-50 text-sm animate-fadeIn"
                role="menu"
              >
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/80 mb-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">Maryam Tabassum</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    Candidate · Frontend Assessment
                  </p>
                </div>

                <div className="px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 rounded-md mb-1.5 flex justify-between items-center">
                  <span>Current Theme</span>
                  <span className="font-mono text-neutral-900 dark:text-neutral-100 capitalize">
                    {theme} Mode
                  </span>
                </div>

                <button
                  onClick={() => {
                    toggleTheme();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-between transition-colors"
                  role="menuitem"
                >
                  <span className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-neutral-400" />
                    <span>{isLight ? 'Switch to Dark' : 'Switch to Light'}</span>
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {isLight ? 'Dark' : 'Light'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenShortcuts();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-between transition-colors"
                  role="menuitem"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-neutral-400" />
                    <span>Keyboard Shortcuts</span>
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">⌘/</span>
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onResetDemoData();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2 transition-colors"
                  role="menuitem"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-400" />
                  <span>Restore Initial Dataset</span>
                </button>

                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1 pt-1">
                  <a
                    href="https://fomi.design"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-3 py-1.5 rounded-md text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center justify-between"
                  >
                    <span>Fomi Creative Tools</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Accessible and Full Navigation) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-[#FAF7F2] dark:bg-[#0F1115] px-4 py-3 space-y-2 animate-fadeIn shadow-lg">
          <button
            onClick={() => {
              onSelectTab('image-workspace');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'image-workspace'
                ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D95338]" />
              <span>Image Studio (Part B)</span>
            </div>
            <span className="text-[11px] font-mono text-[#D95338]">Active</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('saved');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'saved'
                ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4" />
              <span>Saved Works & History</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 font-mono">
              {totalSavedCount}
            </span>
          </button>

          <button
            onClick={() => {
              onSelectTab('content-workspace');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'content-workspace'
                ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Content Generator (Part A)</span>
          </button>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-1">
            <span className="text-xs text-neutral-500">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

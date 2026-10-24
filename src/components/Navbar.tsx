import React from 'react';
import { Sparkles, Github, GitPullRequest, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Tagline */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GitPullRequest className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent font-['Outfit']">
                  OpenStart
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Hacktober Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide hidden sm:block">
                From First Issue to First Contribution
              </p>
            </div>
          </div>

          {/* Tagline for Mobile */}
          <div className="block sm:hidden text-center px-2">
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[170px]">
              From First Issue to First Contribution
            </p>
          </div>

          {/* Right Navigation / GitHub link */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <a
              href="https://github.com/topics/good-first-issue"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-900/60"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Explore Topics</span>
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 shadow-sm transition-all duration-200 group"
            >
              <Github className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
              <span className="hidden xs:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

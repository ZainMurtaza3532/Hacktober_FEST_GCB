import React from 'react';
import { Search, Code2, Tag, X, Filter } from 'lucide-react';

interface SearchFiltersProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  language: string;
  onLanguageChange: (val: string) => void;
  label: string;
  onLabelChange: (val: string) => void;
  totalCount: number;
  isLoading: boolean;
}

const POPULAR_LANGUAGES = [
  { name: 'All Languages', value: '' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'JavaScript', value: 'javascript' },
  { name: 'Python', value: 'python' },
  { name: 'Rust', value: 'rust' },
  { name: 'Go', value: 'go' },
  { name: 'Java', value: 'java' },
  { name: 'C++', value: 'cpp' },
];

const POPULAR_LABELS = [
  'good first issue',
  'help wanted',
  'beginner-friendly',
  'documentation',
  'easy',
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  keyword,
  onKeywordChange,
  language,
  onLanguageChange,
  label,
  onLabelChange,
  totalCount,
  isLoading,
}) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 mb-8 shadow-xl border border-slate-800/80">
      {/* Top Search Input Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-indigo-400" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Search by keywords (e.g. 'bug', 'tailwind', 'docs', 'cli')..."
          className="w-full pl-11 pr-10 py-3.5 bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm sm:text-base font-normal shadow-inner"
        />
        {keyword && (
          <button
            onClick={() => onKeywordChange('')}
            aria-label="Clear keyword search"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Language Selection */}
        <div>
          <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <Code2 className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            Language
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm appearance-none cursor-pointer"
            >
              {POPULAR_LANGUAGES.map((lang) => (
                <option key={lang.value || 'all'} value={lang.value} className="bg-slate-900 text-slate-200">
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
              ▼
            </div>
          </div>

          {/* Quick Language Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {POPULAR_LANGUAGES.slice(0, 5).map((lang) => {
              const active = language.toLowerCase() === lang.value.toLowerCase();
              return (
                <button
                  key={lang.name}
                  type="button"
                  onClick={() => onLanguageChange(lang.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    active
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Label Filter */}
        <div>
          <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <Tag className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Issue Label
          </label>
          <div className="relative">
            <input
              type="text"
              value={label}
              onChange={(e) => onLabelChange(e.target.value)}
              placeholder="e.g. good first issue"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Quick Label Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {POPULAR_LABELS.map((lbl) => {
              const active = label.toLowerCase() === lbl.toLowerCase();
              return (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => onLabelChange(lbl)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    active
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  #{lbl}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Query Status Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Query: <code className="text-indigo-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
              is:issue is:open label:"{label || 'good first issue'}"{language ? ` language:${language}` : ''}{keyword ? ` ${keyword}` : ''}
            </code>
          </span>
        </div>
        <div>
          {isLoading ? (
            <span className="text-indigo-400 animate-pulse font-medium">Searching GitHub...</span>
          ) : (
            <span className="text-slate-400 font-medium">
              Found <strong className="text-slate-200">{totalCount.toLocaleString()}</strong> open issues
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

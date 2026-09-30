import React from 'react';
import { Layers, History, GitCompare, BookOpen, Activity, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scanner' | 'history' | 'compare' | 'signatures';
  setActiveTab: (tab: 'scanner' | 'history' | 'compare' | 'signatures') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, historyCount }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#30363d] bg-[#161b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={() => setActiveTab('scanner')}
        >
          <div className="w-7 h-7 rounded bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff]">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-[#f0f6fc] tracking-tight">StackLens</span>
            <span className="text-xs text-[#8b949e]">/</span>
            <span className="text-xs text-[#8b949e]">Web Architecture Inspector</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === 'scanner'
                ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === 'compare'
                ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]/60'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          <button
            onClick={() => setActiveTab('signatures')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === 'signatures'
                ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Signatures</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded bg-[#30363d] text-[#c9d1d9]">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Status */}
        <div className="hidden sm:flex items-center space-x-3 text-xs text-[#8b949e]">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/30">
            SSRF Guard Active
          </span>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { TECHNOLOGY_SIGNATURES } from '../engines/signatures';
import { Code2, Search, ExternalLink } from 'lucide-react';

export const SignaturesCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const categories = Array.from(new Set(TECHNOLOGY_SIGNATURES.map((s) => s.category)));

  const filtered = TECHNOLOGY_SIGNATURES.filter((sig) => {
    const matchCat = selectedCat === 'ALL' || sig.category === selectedCat;
    const matchSearch =
      sig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.roleInStack.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Technology Signatures Knowledge Base</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Catalog of {TECHNOLOGY_SIGNATURES.length} curated technology detection rules, fingerprints, and architectural roles.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter signatures..."
            className="bg-slate-950 text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-lg text-xs border border-slate-800 focus:outline-none focus:border-blue-500 font-mono w-full sm:w-60"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto py-3 border-b border-slate-800 scrollbar-none text-xs font-mono">
        <button
          onClick={() => setSelectedCat('ALL')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            selectedCat === 'ALL'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({TECHNOLOGY_SIGNATURES.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
              selectedCat === cat
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat} ({TECHNOLOGY_SIGNATURES.filter((s) => s.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid of Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {filtered.map((sig) => (
          <div
            key={sig.id}
            className="bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 p-4 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 font-mono">{sig.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{sig.category}</span>
                </div>

                <a
                  href={sig.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded text-slate-500 hover:text-slate-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{sig.description}</p>

              <div className="mt-2.5 p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                <span className="text-slate-400 font-mono">Role: </span>
                <span>{sig.roleInStack}</span>
              </div>
            </div>

            <div className="mt-3.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{sig.alternatives.length} Alternatives</span>
              <span className="text-emerald-400">Rule Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

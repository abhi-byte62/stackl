import React, { useState } from 'react';
import { Technology } from '../types';
import {
  Code,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileCode,
  Tag,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';

interface TechStackGridProps {
  technologies: Technology[];
}

export const TechStackGrid: React.FC<TechStackGridProps> = ({ technologies }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedTechId, setExpandedTechId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const categories = Array.from(new Set(technologies.map((t) => t.category)));

  const filteredTechnologies = technologies.filter((tech) => {
    if (selectedCategory === 'ALL') return true;
    return tech.category === selectedCategory;
  });

  const toggleEvidence = (id: string) => {
    setExpandedTechId(expandedTechId === id ? null : id);
  };

  return (
    <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30363d]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-[#f0f6fc] flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#58a6ff]" />
              <span>Observed Technology Stack</span>
            </h3>
            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
              {technologies.length} Detected
            </span>
          </div>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Confirmed through HTTP response headers, DOM markers, script assets, and cookies.
          </p>
        </div>

        {/* View mode toggle and category filter */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#0d1117] p-0.5 rounded border border-[#30363d]">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Card View"
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d1117] text-[#f0f6fc] border border-[#30363d] rounded px-2 py-1 text-xs font-mono"
          >
            <option value="ALL">All Categories ({technologies.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({technologies.filter((t) => t.category === cat).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="mt-3.5 overflow-x-auto border border-[#30363d] rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d] font-mono text-[11px]">
              <tr>
                <th className="p-2.5">Technology</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Role in Stack</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5 text-right">Confidence</th>
                <th className="p-2.5 text-center">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d] font-mono text-[11px]">
              {filteredTechnologies.map((tech) => {
                const isExpanded = expandedTechId === tech.id;

                return (
                  <React.Fragment key={tech.id}>
                    <tr className="hover:bg-[#21262d]/50 transition-colors">
                      <td className="p-2.5 font-semibold text-[#f0f6fc]">
                        <div className="flex items-center space-x-1.5">
                          <span>{tech.name}</span>
                          {tech.version && (
                            <span className="px-1 text-[9px] rounded bg-[#21262d] text-[#8b949e]">
                              v{tech.version}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2.5 text-[#8b949e] font-sans">{tech.category}</td>
                      <td className="p-2.5 text-[#c9d1d9] font-sans max-w-xs truncate">{tech.roleInStack}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] uppercase ${
                            tech.isObserved
                              ? 'bg-[#1b4728] text-[#3fb950] border border-[#238636]'
                              : 'bg-[#4d2d00] text-[#d29922] border border-[#9e6a03]'
                          }`}
                        >
                          {tech.isObserved ? 'Observed' : 'Inferred'}
                        </span>
                      </td>
                      <td className="p-2.5 text-right text-[#f0f6fc] font-semibold">{tech.confidence}%</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => toggleEvidence(tech.id)}
                          className="px-2 py-0.5 rounded text-[10px] bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d] transition-colors"
                        >
                          {isExpanded ? 'Hide' : `${tech.evidence.length} Signals`}
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible Evidence Row */}
                    {isExpanded && (
                      <tr className="bg-[#0d1117]">
                        <td colSpan={6} className="p-3 border-t border-[#21262d]">
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold">
                              Evidence Signals for {tech.name}:
                            </div>
                            {tech.evidence.map((ev, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded bg-[#161b22] border border-[#21262d] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
                              >
                                <span className="text-[#58a6ff] font-medium">{ev.source}</span>
                                <span className="text-[#8b949e] font-mono break-all">{ev.sampleValue}</span>
                                <span className="text-[#3fb950] text-[10px]">{ev.confidenceWeight}% Signal Weight</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3.5">
          {filteredTechnologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-[#0d1117] rounded border border-[#30363d] p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-2 border-b border-[#21262d]">
                  <div>
                    <h4 className="text-xs font-semibold text-[#f0f6fc] font-mono">{tech.name}</h4>
                    <span className="text-[10px] text-[#8b949e]">{tech.category}</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                      tech.isObserved
                        ? 'bg-[#1b4728] text-[#3fb950] border border-[#238636]'
                        : 'bg-[#4d2d00] text-[#d29922] border border-[#9e6a03]'
                    }`}
                  >
                    {tech.isObserved ? 'Observed' : 'Inferred'}
                  </span>
                </div>

                <p className="text-xs text-[#8b949e] mt-2 line-clamp-2">{tech.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#21262d] flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
                <span>{tech.evidence.length} Evidence Signals</span>
                <span className="text-[#f0f6fc] font-semibold">{tech.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

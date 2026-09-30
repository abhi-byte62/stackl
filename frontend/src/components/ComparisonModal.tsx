import React, { useState } from 'react';
import { ScanResult } from '../types';
import { GitCompare } from 'lucide-react';

interface ComparisonModalProps {
  scans: ScanResult[];
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ scans }) => {
  const [scanAId, setScanAId] = useState<string>(scans[0]?.id || '');
  const [scanBId, setScanBId] = useState<string>(scans[1]?.id || scans[0]?.id || '');

  const scanA = scans.find((s) => s.id === scanAId) || scans[0];
  const scanB = scans.find((s) => s.id === scanBId) || scans[1] || scans[0];

  if (!scanA || !scanB) {
    return (
      <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-8 text-center text-[#8b949e]">
        <GitCompare className="w-6 h-6 mx-auto mb-2 text-[#6e7681]" />
        <h4 className="text-sm font-semibold text-[#f0f6fc] mb-1">Comparison Requires Scan History</h4>
        <p className="text-xs">Scan at least one website to enable side-by-side stack comparison.</p>
      </div>
    );
  }

  const techNamesA = new Set(scanA.technologies.map((t) => t.name));
  const techNamesB = new Set(scanB.technologies.map((t) => t.name));

  const commonTech = scanA.technologies.filter((t) => techNamesB.has(t.name));
  const onlyInA = scanA.technologies.filter((t) => !techNamesB.has(t.name));
  const onlyInB = scanB.technologies.filter((t) => !techNamesA.has(t.name));

  return (
    <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30363d]">
        <div>
          <div className="flex items-center space-x-2">
            <GitCompare className="w-4 h-4 text-[#58a6ff]" />
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Architecture &amp; Stack Comparison</h3>
          </div>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Compare technology choices and security posture side-by-side.
          </p>
        </div>

        {/* Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={scanAId}
            onChange={(e) => setScanAId(e.target.value)}
            className="bg-[#0d1117] text-[#f0f6fc] border border-[#30363d] text-xs rounded px-2.5 py-1 font-mono"
          >
            {scans.map((s) => (
              <option key={s.id} value={s.id}>
                {s.domain} ({s.technologies.length} tech)
              </option>
            ))}
          </select>

          <span className="text-[#6e7681] font-mono text-xs">vs</span>

          <select
            value={scanBId}
            onChange={(e) => setScanBId(e.target.value)}
            className="bg-[#0d1117] text-[#f0f6fc] border border-[#30363d] text-xs rounded px-2.5 py-1 font-mono"
          >
            {scans.map((s) => (
              <option key={s.id} value={s.id}>
                {s.domain} ({s.technologies.length} tech)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
        {/* Site A Card */}
        <div className="bg-[#0d1117] rounded border border-[#30363d] p-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <div>
              <h4 className="text-sm font-semibold text-[#58a6ff] font-mono">{scanA.domain}</h4>
              <p className="text-[11px] text-[#8b949e] mt-0.5">{scanA.architecture.pattern}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-semibold text-[#3fb950]">
                Grade {scanA.security.securityGrade}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold block mb-1.5">
              Detected Stack ({scanA.technologies.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {scanA.technologies.map((t) => (
                <span
                  key={t.id}
                  className={`px-1.5 py-0.2 rounded text-[11px] font-mono border ${
                    techNamesB.has(t.name)
                      ? 'bg-[#161b22] text-[#c9d1d9] border-[#30363d]'
                      : 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]/40'
                  }`}
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Site B Card */}
        <div className="bg-[#0d1117] rounded border border-[#30363d] p-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <div>
              <h4 className="text-sm font-semibold text-[#58a6ff] font-mono">{scanB.domain}</h4>
              <p className="text-[11px] text-[#8b949e] mt-0.5">{scanB.architecture.pattern}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-semibold text-[#3fb950]">
                Grade {scanB.security.securityGrade}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold block mb-1.5">
              Detected Stack ({scanB.technologies.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {scanB.technologies.map((t) => (
                <span
                  key={t.id}
                  className={`px-1.5 py-0.2 rounded text-[11px] font-mono border ${
                    techNamesA.has(t.name)
                      ? 'bg-[#161b22] text-[#c9d1d9] border-[#30363d]'
                      : 'bg-[#1b4728] text-[#3fb950] border-[#238636]'
                  }`}
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Differences Table */}
      <div className="mt-4 bg-[#0d1117] rounded border border-[#30363d] p-3.5 space-y-2.5">
        <div className="text-xs font-mono uppercase text-[#8b949e] font-semibold">
          Overlap &amp; Difference Summary
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div className="bg-[#161b22] p-2.5 rounded border border-[#21262d]">
            <span className="text-[10px] text-[#8b949e] block mb-1">
              Shared Technologies ({commonTech.length})
            </span>
            <div className="text-[#c9d1d9]">
              {commonTech.map((t) => t.name).join(', ') || 'None'}
            </div>
          </div>

          <div className="bg-[#161b22] p-2.5 rounded border border-[#21262d]">
            <span className="text-[10px] text-[#58a6ff] block mb-1">
              Exclusive to {scanA.domain} ({onlyInA.length})
            </span>
            <div className="text-[#c9d1d9]">
              {onlyInA.map((t) => t.name).join(', ') || 'None'}
            </div>
          </div>

          <div className="bg-[#161b22] p-2.5 rounded border border-[#21262d]">
            <span className="text-[10px] text-[#3fb950] block mb-1">
              Exclusive to {scanB.domain} ({onlyInB.length})
            </span>
            <div className="text-[#c9d1d9]">
              {onlyInB.map((t) => t.name).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

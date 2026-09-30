import React from 'react';
import { ScanResult } from '../types';
import { History, Trash2, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectScan,
  onClearHistory,
}) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Scan History &amp; Audits</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Past site scans and reconstructed engineering blueprints stored locally.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900 text-xs font-mono transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-mono text-xs">
          <History className="w-6 h-6 mx-auto mb-2 text-slate-600" />
          <p>No historical scans recorded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100 font-mono">{item.domain}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.architecture.pattern}</p>
                  </div>
                  <span className="px-1.5 py-0.5 text-[9px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                    Grade {item.security.securityGrade}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {item.technologies.slice(0, 5).map((t) => (
                    <span
                      key={t.id}
                      className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {t.name}
                    </span>
                  ))}
                  {item.technologies.length > 5 && (
                    <span className="px-1 py-0.2 text-[10px] font-mono rounded bg-slate-900 text-slate-500">
                      +{item.technologies.length - 5}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 text-[11px]">
                  {new Date(item.scannedAt).toLocaleTimeString()} • {item.scanDurationMs}ms
                </span>

                <button
                  onClick={() => onSelectScan(item)}
                  className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Load</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

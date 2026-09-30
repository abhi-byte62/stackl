import React, { useState } from 'react';
import { ScanResult } from '../types';
import { Terminal, FileCode, Cookie, Network, Copy, Check } from 'lucide-react';

interface RawInspectionViewProps {
  scanResult: ScanResult;
}

export const RawInspectionView: React.FC<RawInspectionViewProps> = ({ scanResult }) => {
  const [activeTab, setActiveTab] = useState<'headers' | 'scripts' | 'cookies'>('headers');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(scanResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30363d]">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#58a6ff]" />
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Raw Telemetry &amp; HTTP Signals</h3>
          </div>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Directly observed HTTP response headers, external script assets, and cookies.
          </p>
        </div>

        <button
          onClick={handleCopyJson}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] text-xs font-mono transition-colors self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5 text-[#58a6ff]" />}
          <span>{copied ? 'Copied' : 'Copy JSON'}</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-1 py-2.5 border-b border-[#30363d] text-xs font-mono">
        <button
          onClick={() => setActiveTab('headers')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'headers'
              ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Headers ({Object.keys(scanResult.rawHeaders).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scripts')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'scripts'
              ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Scripts ({scanResult.detectedScripts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cookies')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'cookies'
              ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
          }`}
        >
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookies ({scanResult.cookiesFound.length})</span>
        </button>
      </div>

      {/* Content */}
      <div className="mt-3 font-mono text-xs">
        {activeTab === 'headers' && (
          <div className="bg-[#0d1117] rounded border border-[#30363d] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#161b22] text-[#8b949e] border-b border-[#30363d] text-[10px]">
                <tr>
                  <th className="p-2 w-1/3">Header Key</th>
                  <th className="p-2">Header Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d] text-[11px]">
                {Object.entries(scanResult.rawHeaders).map(([k, v]) => (
                  <tr key={k} className="hover:bg-[#161b22]/50">
                    <td className="p-2 font-semibold text-[#58a6ff]">{k}</td>
                    <td className="p-2 text-[#c9d1d9] break-all">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="bg-[#0d1117] rounded border border-[#30363d] p-3 space-y-1.5">
            {scanResult.detectedScripts.length > 0 ? (
              scanResult.detectedScripts.map((s, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded bg-[#161b22] border border-[#21262d] text-[#c9d1d9] text-[11px] break-all"
                >
                  <span className="text-[#6e7681] mr-2">[{idx + 1}]</span>
                  {s}
                </div>
              ))
            ) : (
              <div className="text-[#6e7681] text-center py-4">No external scripts identified.</div>
            )}
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="bg-[#0d1117] rounded border border-[#30363d] p-3 space-y-1.5">
            {scanResult.cookiesFound.length > 0 ? (
              scanResult.cookiesFound.map((c, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded bg-[#161b22] border border-[#21262d] text-[#c9d1d9] text-[11px] break-all"
                >
                  <span className="text-[#d29922] mr-2">Set-Cookie:</span>
                  {c}
                </div>
              ))
            ) : (
              <div className="text-[#6e7681] text-center py-4">No cookies recorded on initial response.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

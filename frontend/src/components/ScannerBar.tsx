import React, { useState } from 'react';
import { Search, Globe, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { PRESET_SITES, PresetSite } from '../services/presets';
import { validateUrlSafety } from '../engines/analyzer';

interface ScannerBarProps {
  onScan: (url: string, preset?: PresetSite) => void;
  isScanning: boolean;
  scanStep: number;
}

const SCAN_STEPS = [
  'Validating target URL & resolving DNS records...',
  'Inspecting TLS handshake & HTTP response headers...',
  'Parsing HTML DOM structure & metadata generators...',
  'Extracting JavaScript bundles & script signatures...',
  'Matching technology signatures & evidence weights...',
  'Inferring architecture DAG & generating system blueprint...',
];

export const ScannerBar: React.FC<ScannerBarProps> = ({ onScan, isScanning, scanStep }) => {
  const [inputUrl, setInputUrl] = useState('https://stripe.com');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isScanning) return;

    const validation = validateUrlSafety(inputUrl);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid target URL');
      return;
    }

    setValidationError(null);
    onScan(validation.cleanUrl || inputUrl);
  };

  const handleSelectPreset = (preset: PresetSite) => {
    setInputUrl(preset.url);
    setValidationError(null);
    onScan(preset.url, preset);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Hero Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-[#f0f6fc]">
          Inspect website architecture &amp; engineering stack
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#8b949e] max-w-2xl mx-auto">
          Analyze public web applications to observe frontend frameworks, CDN edges, API gateways, and reconstruct their system architecture.
        </p>
      </div>

      {/* Main Form Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-[#161b22] p-1.5 rounded-lg border border-[#30363d] focus-within:border-[#58a6ff] transition-colors">
          <div className="flex items-center flex-1 px-3 py-1">
            <Globe className="w-4 h-4 text-[#8b949e] mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="https://example.com"
              disabled={isScanning}
              className="w-full bg-transparent text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className={`flex items-center justify-center space-x-1.5 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
              isScanning
                ? 'bg-[#21262d] text-[#8b949e] cursor-not-allowed'
                : 'bg-[#1f6feb] hover:bg-[#388bfd] text-white'
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Presets Toolbar */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
        <span className="text-[#8b949e] mr-1">Examples:</span>
        {PRESET_SITES.map((preset) => (
          <button
            key={preset.domain}
            onClick={() => handleSelectPreset(preset)}
            disabled={isScanning}
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d] transition-colors"
          >
            {preset.domain}
          </button>
        ))}
      </div>

      {/* SSRF Validation Warning */}
      {validationError && (
        <div className="mt-3 flex items-start space-x-2 p-2.5 rounded bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149] text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>SSRF Guard: </strong>
            <span>{validationError}</span>
          </div>
        </div>
      )}

      {/* Analysis Stepper Progress */}
      {isScanning && (
        <div className="mt-5 p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] text-xs font-mono">
          <div className="flex items-center justify-between mb-2 text-[#8b949e]">
            <span className="flex items-center space-x-2 text-[#f0f6fc]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#58a6ff]" />
              <span>Analyzing {inputUrl}...</span>
            </span>
            <span>Step {scanStep + 1} of {SCAN_STEPS.length}</span>
          </div>

          <div className="w-full h-1 bg-[#21262d] rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-[#1f6feb] transition-all duration-300"
              style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="space-y-0.5 text-[11px]">
            {SCAN_STEPS.map((stepDesc, idx) => {
              const isCompleted = idx < scanStep;
              const isCurrent = idx === scanStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-2 ${
                    isCompleted
                      ? 'text-[#3fb950]'
                      : isCurrent
                      ? 'text-[#58a6ff] font-semibold'
                      : 'text-[#484f58]'
                  }`}
                >
                  <span className="w-3 text-center">{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span>
                  <span>{stepDesc}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScannerBar } from './components/ScannerBar';
import { ArchitectureGraph } from './components/ArchitectureGraph';
import { TechStackGrid } from './components/TechStackGrid';
import { BlueprintViewer } from './components/BlueprintViewer';
import { SecurityRadar } from './components/SecurityRadar';
import { RawInspectionView } from './components/RawInspectionView';
import { ComparisonModal } from './components/ComparisonModal';
import { SignaturesCatalog } from './components/SignaturesCatalog';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PRESET_SITES, PresetSite } from './services/presets';
import { performSafeAnalysis, RawScanInput } from './engines/analyzer';
import { ScanResult } from './types';
import {
  Layers,
  Code2,
  FileText,
  Terminal,
  RotateCw,
  Download,
  Share2,
  Check,
} from 'lucide-react';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<'scanner' | 'history' | 'compare' | 'signatures'>('scanner');
  const [activeInspectorView, setActiveInspectorView] = useState<'overview' | 'architecture' | 'stack' | 'blueprint' | 'security' | 'raw'>('overview');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize with Stripe default preset
  const defaultScan = performSafeAnalysis(PRESET_SITES[0].rawInput);
  const [currentScan, setCurrentScan] = useState<ScanResult>(defaultScan);
  const [history, setHistory] = useState<ScanResult[]>([defaultScan]);

  // Handle Scanning trigger
  const handleStartScan = async (targetUrl: string, preset?: PresetSite) => {
    setIsScanning(true);
    setScanStep(0);

    // Realistic scanning progression
    for (let step = 0; step < 6; step++) {
      setScanStep(step);
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 120));
    }

    let scanResult: ScanResult;

    if (preset) {
      scanResult = performSafeAnalysis(preset.rawInput);
    } else {
      const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
      const domain = parsed.hostname;

      const matchedPreset = PRESET_SITES.find((p) => p.domain.toLowerCase() === domain.toLowerCase());
      if (matchedPreset) {
        scanResult = performSafeAnalysis(matchedPreset.rawInput);
      } else {
        const dynamicInput: RawScanInput = {
          url: parsed.href,
          headers: {
            server: 'cloudflare',
            'cf-ray': `${Math.random().toString(36).substring(2, 10)}-IAD`,
            'strict-transport-security': 'max-age=31536000; includeSubDomains',
            'content-security-policy': "default-src 'self' https:;",
            'x-frame-options': 'SAMEORIGIN',
            'x-content-type-options': 'nosniff',
          },
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <title>${domain} | Web Application</title>
                <meta name="generator" content="Next.js" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </head>
              <body>
                <div id="__next">
                  <div class="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col justify-between">
                    <header class="p-4 border-b border-[#30363d]">Navigation</header>
                    <main class="flex-1 p-6">App Content for ${domain}</main>
                  </div>
                </div>
              </body>
            </html>
          `,
          scripts: [
            `https://${domain}/_next/static/chunks/main-app.js`,
            `https://${domain}/_next/static/chunks/webpack.js`,
            'https://www.google-analytics.com/gtag/js',
            'https://browser.sentry-cdn.com/bundle.min.js',
          ],
          cookies: ['_ga=GA1.2.883719', 'cf_clearance=89237492'],
          dns: {
            ipAddresses: ['104.21.19.88', '172.67.142.11'],
            hostingProvider: 'Cloudflare Edge / AWS',
            asn: 'AS13335 CLOUDFLARENET',
            nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
          },
        };

        scanResult = performSafeAnalysis(dynamicInput);
      }
    }

    setCurrentScan(scanResult);
    setHistory((prev) => {
      const filtered = prev.filter((s) => s.domain !== scanResult.domain);
      return [scanResult, ...filtered];
    });

    setIsScanning(false);
    setActiveNavTab('scanner');
  };

  const handleSelectHistoryScan = (scan: ScanResult) => {
    setCurrentScan(scan);
    setActiveNavTab('scanner');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleShareReport = () => {
    navigator.clipboard.writeText(window.location.origin + '?url=' + encodeURIComponent(currentScan.targetUrl));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const observedCount = currentScan.technologies.filter((t) => t.isObserved).length;
  const inferredCount = currentScan.technologies.filter((t) => !t.isObserved).length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col">
      {/* Header */}
      <Header
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        historyCount={history.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Scanner Bar (Hero & Input) */}
        {activeNavTab === 'scanner' && (
          <ScannerBar
            onScan={handleStartScan}
            isScanning={isScanning}
            scanStep={scanStep}
          />
        )}

        {/* View 1: Inspector Dashboard */}
        {activeNavTab === 'scanner' && currentScan && (
          <div className="space-y-4">
            {/* Analysis Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#161b22] border border-[#30363d]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-[#21262d] border border-[#30363d] flex items-center justify-center font-mono font-bold text-[#58a6ff] text-sm">
                  {currentScan.domain.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-sm font-semibold text-[#f0f6fc] font-mono">{currentScan.domain}</h2>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#1b4728] text-[#3fb950] border border-[#238636]">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-[#8b949e] font-mono mt-0.5">
                    <span>{currentScan.scanDurationMs}ms</span>
                    <span>•</span>
                    <span>{currentScan.technologies.length} Technologies ({observedCount} Observed, {inferredCount} Inferred)</span>
                    <span>•</span>
                    <span>Grade {currentScan.security.securityGrade}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Sub-Navigation */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleStartScan(currentScan.targetUrl)}
                  disabled={isScanning}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] text-xs font-mono transition-colors"
                >
                  <RotateCw className="w-3 h-3 text-[#8b949e]" />
                  <span>Re-scan</span>
                </button>

                <button
                  onClick={handleShareReport}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] text-xs font-mono transition-colors"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-[#3fb950]" /> : <Share2 className="w-3 h-3 text-[#8b949e]" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Sub-Navigation Switcher Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-[#30363d] pb-0 text-xs font-mono">
              <button
                onClick={() => setActiveInspectorView('overview')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeInspectorView === 'overview'
                    ? 'border-[#58a6ff] text-[#f0f6fc]'
                    : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveInspectorView('architecture')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeInspectorView === 'architecture'
                    ? 'border-[#58a6ff] text-[#f0f6fc]'
                    : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                Architecture DAG
              </button>
              <button
                onClick={() => setActiveInspectorView('stack')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeInspectorView === 'stack'
                    ? 'border-[#58a6ff] text-[#f0f6fc]'
                    : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                Technologies ({currentScan.technologies.length})
              </button>
              <button
                onClick={() => setActiveInspectorView('blueprint')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeInspectorView === 'blueprint'
                    ? 'border-[#58a6ff] text-[#f0f6fc]'
                    : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                Engineering Blueprint
              </button>
              <button
                onClick={() => setActiveInspectorView('security')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeInspectorView === 'security'
                    ? 'border-[#58a6ff] text-[#f0f6fc]'
                    : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                Security &amp; DNS
              </button>
              <button
                onClick={() => setActiveInspectorView('raw')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeInspectorView === 'raw'
                    ? 'border-[#58a6ff] text-[#f0f6fc]'
                    : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                Raw Signals
              </button>
            </div>

            {/* Overview Tab Content */}
            {activeInspectorView === 'overview' && (
              <div className="space-y-4 pt-1">
                {/* Architecture Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div className="bg-[#161b22] p-3 rounded border border-[#30363d]">
                    <span className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold block">
                      Frontend Framework
                    </span>
                    <div className="text-xs font-semibold text-[#f0f6fc] font-mono mt-0.5">
                      {currentScan.technologies.find((t) => t.category === 'Frontend Framework')?.name || 'Custom Presentation'}
                    </div>
                    <span className="text-[10px] text-[#3fb950] font-mono block mt-1">
                      Direct DOM / Script Signal
                    </span>
                  </div>

                  <div className="bg-[#161b22] p-3 rounded border border-[#30363d]">
                    <span className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold block">
                      CDN &amp; Ingress
                    </span>
                    <div className="text-xs font-semibold text-[#f0f6fc] font-mono mt-0.5">
                      {currentScan.technologies.find((t) => t.category === 'CDN & Edge Network')?.name || currentScan.dns.hostingProvider}
                    </div>
                    <span className="text-[10px] text-[#58a6ff] font-mono block mt-1">
                      HTTP Header Match
                    </span>
                  </div>

                  <div className="bg-[#161b22] p-3 rounded border border-[#30363d]">
                    <span className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold block">
                      Inferred Backend
                    </span>
                    <div className="text-xs font-semibold text-[#f0f6fc] font-mono mt-0.5">
                      {currentScan.architecture.nodes.find((n) => n.category === 'backend')?.label || 'Microservices'}
                    </div>
                    <span className="text-[10px] text-[#d29922] font-mono block mt-1">
                      Architectural Deduction
                    </span>
                  </div>

                  <div className="bg-[#161b22] p-3 rounded border border-[#30363d]">
                    <span className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold block">
                      Persistence Tier
                    </span>
                    <div className="text-xs font-semibold text-[#f0f6fc] font-mono mt-0.5">
                      PostgreSQL + Redis
                    </div>
                    <span className="text-[10px] text-[#d29922] font-mono block mt-1">
                      Relational &amp; Cache Store
                    </span>
                  </div>
                </div>

                {/* Architecture DAG */}
                <ArchitectureGraph architecture={currentScan.architecture} domain={currentScan.domain} />

                {/* Stack & Blueprint Quick Previews */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-[#161b22] p-4 rounded border border-[#30363d] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                        <span className="text-xs font-semibold text-[#f0f6fc] uppercase font-mono">
                          Observed Technologies ({observedCount})
                        </span>
                        <button
                          onClick={() => setActiveInspectorView('stack')}
                          className="text-xs text-[#58a6ff] hover:text-[#79c0ff] font-mono"
                        >
                          View All →
                        </button>
                      </div>
                      <div className="mt-2.5 space-y-1.5">
                        {currentScan.technologies.slice(0, 5).map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-1.5 rounded bg-[#0d1117] border border-[#21262d] text-xs font-mono"
                          >
                            <span className="text-[#f0f6fc] font-medium">{t.name}</span>
                            <span className="text-[#8b949e] text-[11px]">{t.category}</span>
                            <span className="text-[#3fb950]">{t.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#161b22] p-4 rounded border border-[#30363d] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                        <span className="text-xs font-semibold text-[#f0f6fc] uppercase font-mono">
                          Engineering Blueprint Overview
                        </span>
                        <button
                          onClick={() => setActiveInspectorView('blueprint')}
                          className="text-xs text-[#58a6ff] hover:text-[#79c0ff] font-mono"
                        >
                          Full Spec →
                        </button>
                      </div>
                      <p className="text-xs text-[#c9d1d9] mt-2.5 leading-relaxed">
                        {currentScan.blueprint.overview}
                      </p>
                      <div className="mt-2.5 p-2 rounded bg-[#0d1117] border border-[#21262d] text-xs font-mono text-[#8b949e]">
                        <span>Target Scale: </span>
                        <span className="text-[#f0f6fc]">{currentScan.blueprint.targetScale}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view: Architecture Graph */}
            {activeInspectorView === 'architecture' && (
              <ArchitectureGraph architecture={currentScan.architecture} domain={currentScan.domain} />
            )}

            {/* Sub-view: Detected Tech Stack Grid */}
            {activeInspectorView === 'stack' && (
              <TechStackGrid technologies={currentScan.technologies} />
            )}

            {/* Sub-view: Engineering Blueprint */}
            {activeInspectorView === 'blueprint' && (
              <BlueprintViewer blueprint={currentScan.blueprint} domain={currentScan.domain} />
            )}

            {/* Sub-view: Security & DNS Radar */}
            {activeInspectorView === 'security' && (
              <SecurityRadar
                security={currentScan.security}
                dns={currentScan.dns}
                domain={currentScan.domain}
              />
            )}

            {/* Sub-view: Raw Headers & Payload */}
            {activeInspectorView === 'raw' && (
              <RawInspectionView scanResult={currentScan} />
            )}
          </div>
        )}

        {/* View 2: Compare Tool */}
        {activeNavTab === 'compare' && (
          <ComparisonModal scans={history} onClose={() => setActiveNavTab('scanner')} />
        )}

        {/* View 3: Signatures Catalog */}
        {activeNavTab === 'signatures' && <SignaturesCatalog />}

        {/* View 4: Scan History */}
        {activeNavTab === 'history' && (
          <HistoryDrawer
            history={history}
            onSelectScan={handleSelectHistoryScan}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#30363d] bg-[#161b22] py-4 mt-10 text-center text-xs text-[#8b949e] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StackLens Engine • Web Architecture Inspector</span>
          <span className="text-[#6e7681]">React + TypeScript • Spring Boot • PostgreSQL • RabbitMQ • Redis</span>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import {
  ArchitectureDiagram,
  ArchitectureNode,
} from '../types';
import {
  Layers,
  ArrowRight,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Server,
  Database,
  Globe,
  Lock,
} from 'lucide-react';

interface ArchitectureGraphProps {
  architecture: ArchitectureDiagram;
  domain: string;
}

export const ArchitectureGraph: React.FC<ArchitectureGraphProps> = ({ architecture, domain }) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(architecture.nodes[1] || null);
  const [filterType, setFilterType] = useState<'ALL' | 'OBSERVED' | 'INFERRED'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filteredNodes = architecture.nodes.filter((node) => {
    if (filterType === 'OBSERVED') return node.isObserved;
    if (filterType === 'INFERRED') return !node.isObserved;
    return true;
  });

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.75, Math.min(1.25, Number((prev + delta).toFixed(2)))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-5">
      {/* Graph Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#30363d]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-[#f0f6fc] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#58a6ff]" />
              <span>System Architecture Model</span>
            </h3>
            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
              {architecture.nodes.length} Components
            </span>
          </div>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Click any component to inspect runtime role, observable evidence, and confidence rating.
          </p>
        </div>

        {/* Filter and Viewport Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center space-x-1 bg-[#0d1117] p-0.5 rounded border border-[#30363d] text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterType === 'ALL'
                  ? 'bg-[#21262d] text-[#f0f6fc]'
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              All ({architecture.nodes.length})
            </button>
            <button
              onClick={() => setFilterType('OBSERVED')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterType === 'OBSERVED'
                  ? 'bg-[#1b4728] text-[#3fb950] border border-[#238636]'
                  : 'text-[#8b949e] hover:text-[#3fb950]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
              <span>Observed ({architecture.nodes.filter((n) => n.isObserved).length})</span>
            </button>
            <button
              onClick={() => setFilterType('INFERRED')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterType === 'INFERRED'
                  ? 'bg-[#4d2d00] text-[#d29922] border border-[#9e6a03]'
                  : 'text-[#8b949e] hover:text-[#d29922]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d29922]" />
              <span>Inferred ({architecture.nodes.filter((n) => !n.isObserved).length})</span>
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center space-x-1 bg-[#0d1117] p-0.5 rounded border border-[#30363d]">
            <button
              onClick={() => handleZoom(0.1)}
              title="Zoom In"
              className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              title="Zoom Out"
              className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="px-1.5 py-0.5 rounded text-[#8b949e] hover:text-[#f0f6fc] text-[10px] font-mono"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagram Area & Detail Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-4">
        {/* Diagram Canvas */}
        <div className="xl:col-span-8 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 min-h-[400px] flex flex-col justify-between overflow-x-auto">
          {/* Legend Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#21262d] text-xs">
            <div className="flex items-center space-x-4 text-[11px] font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
                <span className="text-[#8b949e]">Confirmed (Observable)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d29922]" />
                <span className="text-[#8b949e]">Inferred (Backend Component)</span>
              </div>
            </div>
            <span className="text-[11px] text-[#6e7681] font-mono">Pipeline: Ingress ➔ Edge ➔ App ➔ Data</span>
          </div>

          {/* Flow Container */}
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-3 py-4 transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          >
            {/* Stage 1: Client & Ingress */}
            <div className="flex flex-col gap-2.5 w-full md:w-44">
              <div className="text-[10px] font-mono text-[#6e7681] uppercase font-semibold px-1">Ingress</div>
              {filteredNodes
                .filter((n) => ['client', 'cdn'].includes(n.category))
                .map((node) => renderNodeCard(node, selectedNode, setSelectedNode))}
            </div>

            <div className="hidden md:flex flex-col items-center justify-center text-[#484f58]">
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono text-[#6e7681] mt-0.5">HTTPS</span>
            </div>

            {/* Stage 2: Presentation & Gateway */}
            <div className="flex flex-col gap-2.5 w-full md:w-48">
              <div className="text-[10px] font-mono text-[#6e7681] uppercase font-semibold px-1">Application Layer</div>
              {filteredNodes
                .filter((n) => ['frontend', 'api'].includes(n.category))
                .map((node) => renderNodeCard(node, selectedNode, setSelectedNode))}
            </div>

            <div className="hidden md:flex flex-col items-center justify-center text-[#484f58]">
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono text-[#6e7681] mt-0.5">RPC/HTTP</span>
            </div>

            {/* Stage 3: Core Backend */}
            <div className="flex flex-col gap-2.5 w-full md:w-48">
              <div className="text-[10px] font-mono text-[#6e7681] uppercase font-semibold px-1">Core Services</div>
              {filteredNodes
                .filter((n) => ['backend', 'external'].includes(n.category))
                .map((node) => renderNodeCard(node, selectedNode, setSelectedNode))}
            </div>

            <div className="hidden md:flex flex-col items-center justify-center text-[#484f58]">
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono text-[#6e7681] mt-0.5">TCP/SQL</span>
            </div>

            {/* Stage 4: Persistence, Cache & Queues */}
            <div className="flex flex-col gap-2.5 w-full md:w-48">
              <div className="text-[10px] font-mono text-[#6e7681] uppercase font-semibold px-1">Data &amp; Queues</div>
              {filteredNodes
                .filter((n) => ['database', 'cache', 'queue'].includes(n.category))
                .map((node) => renderNodeCard(node, selectedNode, setSelectedNode))}
            </div>
          </div>

          {/* Canvas Footer */}
          <div className="pt-2.5 border-t border-[#21262d] text-[11px] text-[#8b949e] flex items-center justify-between font-mono">
            <span>Pattern: <strong className="text-[#f0f6fc]">{architecture.pattern}</strong></span>
            <span className="text-[#6e7681]">Tier Depth: {architecture.tierCount}</span>
          </div>
        </div>

        {/* Selected Node Details Inspector */}
        <div className="xl:col-span-4 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 flex flex-col justify-between">
          {selectedNode ? (
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-2.5 border-b border-[#21262d]">
                <div>
                  <h4 className="text-sm font-semibold text-[#f0f6fc] font-mono">{selectedNode.label}</h4>
                  <p className="text-[11px] text-[#8b949e] mt-0.5">{selectedNode.sublabel}</p>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[10px] font-mono uppercase ${
                      selectedNode.isObserved
                        ? 'bg-[#1b4728] text-[#3fb950] border border-[#238636]'
                        : 'bg-[#4d2d00] text-[#d29922] border border-[#9e6a03]'
                    }`}
                  >
                    <span>{selectedNode.isObserved ? 'Observed' : 'Inferred'}</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#8b949e] mt-1">
                    {selectedNode.confidence}% Conf.
                  </span>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="mt-2.5">
                <div className="w-full h-1 bg-[#21262d] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      selectedNode.confidence >= 90
                        ? 'bg-[#3fb950]'
                        : selectedNode.confidence >= 75
                        ? 'bg-[#58a6ff]'
                        : 'bg-[#d29922]'
                    }`}
                    style={{ width: `${selectedNode.confidence}%` }}
                  />
                </div>
              </div>

              {/* Role in Stack */}
              <div className="mt-3.5">
                <div className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold mb-1">
                  Component Role
                </div>
                <p className="text-xs text-[#c9d1d9] leading-relaxed bg-[#161b22] p-2 rounded border border-[#21262d]">
                  {selectedNode.role}
                </p>
              </div>

              {/* Concrete Evidence Trail */}
              <div className="mt-3.5">
                <div className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold mb-1">
                  Evidence Trail &amp; Signals
                </div>
                <p className="text-xs text-[#8b949e] bg-[#161b22] p-2 rounded border border-[#21262d] font-mono leading-relaxed break-words text-[11px]">
                  {selectedNode.evidenceSummary}
                </p>
              </div>

              {/* Alternatives */}
              {selectedNode.alternatives && selectedNode.alternatives.length > 0 && (
                <div className="mt-3.5">
                  <div className="text-[10px] font-mono uppercase text-[#8b949e] font-semibold mb-1">
                    Alternative Choices
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.alternatives.map((alt) => (
                      <span
                        key={alt}
                        className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#161b22] text-[#8b949e] border border-[#21262d]"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6e7681]">
              <Info className="w-5 h-5 mb-2" />
              <p className="text-xs">Click any component node to inspect its runtime role and evidence.</p>
            </div>
          )}

          <div className="mt-4 pt-2 border-t border-[#21262d] text-[10px] text-[#6e7681] flex items-center justify-between font-mono">
            <span>Target: {domain}</span>
            <span>Deterministic Model</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function renderNodeCard(
  node: ArchitectureNode,
  selectedNode: ArchitectureNode | null,
  setSelectedNode: (node: ArchitectureNode) => void
) {
  const isSelected = selectedNode?.id === node.id;

  return (
    <button
      key={node.id}
      onClick={() => setSelectedNode(node)}
      className={`text-left p-2.5 rounded border transition-colors cursor-pointer w-full ${
        isSelected
          ? 'bg-[#1f6feb]/15 border-[#58a6ff] text-[#f0f6fc]'
          : 'bg-[#161b22] hover:bg-[#21262d] border-[#30363d]'
      }`}
    >
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-semibold text-[#f0f6fc] font-mono line-clamp-1">
          {node.label}
        </h5>
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            node.isObserved ? 'bg-[#3fb950]' : 'bg-[#d29922]'
          }`}
        />
      </div>

      <p className="text-[10px] text-[#8b949e] line-clamp-1 mt-0.5">{node.sublabel}</p>

      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-[#8b949e]">
        <span
          className={`px-1 py-0.2 rounded text-[9px] ${
            node.isObserved ? 'text-[#3fb950] bg-[#1b4728]/60' : 'text-[#d29922] bg-[#4d2d00]/60'
          }`}
        >
          {node.isObserved ? 'OBSERVED' : 'INFERRED'}
        </span>
        <span className="text-[#8b949e]">{node.confidence}%</span>
      </div>
    </button>
  );
}

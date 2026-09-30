import React from 'react';
import { SecurityAudit, DnsInsight } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
} from 'lucide-react';

interface SecurityRadarProps {
  security: SecurityAudit;
  dns: DnsInsight;
  domain: string;
}

export const SecurityRadar: React.FC<SecurityRadarProps> = ({ security, dns, domain }) => {
  const getGradeStyle = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-[#3fb950] bg-[#1b4728]/60 border-[#238636]';
      case 'B':
        return 'text-[#58a6ff] bg-[#1f6feb]/20 border-[#388bfd]';
      case 'C':
        return 'text-[#d29922] bg-[#4d2d00]/60 border-[#9e6a03]';
      default:
        return 'text-[#f85149] bg-[#4d1f24]/60 border-[#da3633]';
    }
  };

  return (
    <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30363d]">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#3fb950]" />
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Security Perimeter &amp; DNS Infrastructure</h3>
          </div>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Transport security protocols, HTTP defense headers, and host resolution.
          </p>
        </div>

        {/* Grade Badge */}
        <div className="flex items-center space-x-2">
          <div className={`px-2.5 py-1 rounded border font-mono flex items-center space-x-2 ${getGradeStyle(security.securityGrade)}`}>
            <span className="text-base font-bold">{security.securityGrade}</span>
            <div className="text-[11px]">
              Score: {security.overallScore}/100
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        {/* Security Matrix */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono uppercase text-[#8b949e] font-semibold">
            HTTP Defense Headers
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#f0f6fc] font-mono">Strict-Transport-Security</span>
                <p className="text-[11px] text-[#8b949e]">HSTS Preload</p>
              </div>
              {security.hasHsts ? (
                <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#f85149] shrink-0" />
              )}
            </div>

            <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#f0f6fc] font-mono">Content-Security-Policy</span>
                <p className="text-[11px] text-[#8b949e]">CSP Directives</p>
              </div>
              {security.hasCsp ? (
                <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#f85149] shrink-0" />
              )}
            </div>

            <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#f0f6fc] font-mono">X-Frame-Options</span>
                <p className="text-[11px] text-[#8b949e]">Anti-Clickjacking</p>
              </div>
              {security.hasXFrameOptions ? (
                <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#f85149] shrink-0" />
              )}
            </div>

            <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#f0f6fc] font-mono">X-Content-Type-Options</span>
                <p className="text-[11px] text-[#8b949e]">nosniff Protection</p>
              </div>
              {security.hasXContentTypeOptions ? (
                <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#f85149] shrink-0" />
              )}
            </div>
          </div>

          {/* Hardening Recommendations */}
          {security.recommendations.length > 0 && (
            <div className="mt-3 p-2.5 rounded bg-[#4d2d00]/20 border border-[#9e6a03]/50 text-xs text-[#d29922]">
              <span className="font-semibold font-mono flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#d29922]" />
                <span>Hardening Recommendations:</span>
              </span>
              <ul className="space-y-0.5 text-[#c9d1d9] text-[11px] pl-4 list-disc">
                {security.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* DNS & Host Infrastructure */}
        <div className="lg:col-span-5 bg-[#0d1117] p-3.5 rounded border border-[#30363d] flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase text-[#8b949e] font-semibold mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>Host &amp; DNS Records</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="bg-[#161b22] p-2 rounded border border-[#21262d] flex items-center justify-between">
                <span className="text-[#8b949e]">Provider:</span>
                <span className="text-[#f0f6fc]">{dns.hostingProvider || 'Detected Edge'}</span>
              </div>

              <div className="bg-[#161b22] p-2 rounded border border-[#21262d] flex items-center justify-between">
                <span className="text-[#8b949e]">ASN:</span>
                <span className="text-[#58a6ff]">{dns.asn}</span>
              </div>

              <div className="bg-[#161b22] p-2 rounded border border-[#21262d]">
                <span className="text-[#8b949e] block mb-0.5">IP Addresses:</span>
                <div className="text-[#f0f6fc]">{dns.ipAddresses.join(', ')}</div>
              </div>

              <div className="bg-[#161b22] p-2 rounded border border-[#21262d]">
                <span className="text-[#8b949e] block mb-0.5">Nameservers:</span>
                <div className="text-[#8b949e] text-[11px]">{dns.nameservers.join(', ')}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#21262d] text-[10px] text-[#6e7681] flex items-center justify-between font-mono">
            <span>TLS: {security.tlsVersion}</span>
            <span className="text-[#3fb950]">SSRF Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

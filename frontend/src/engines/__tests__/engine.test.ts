import { describe, it, expect } from 'vitest';
import { validateUrlSafety, performSafeAnalysis, RawScanInput } from '../analyzer';
import { inferArchitecture } from '../inference';
import { generateBlueprint } from '../blueprint';
import { PRESET_SITES } from '../../services/presets';

describe('StackLens SSRF Protection & URL Validation Engine', () => {
  it('accepts valid public HTTP and HTTPS domains', () => {
    const valid1 = validateUrlSafety('https://stripe.com');
    expect(valid1.isValid).toBe(true);
    expect(valid1.cleanUrl).toBe('https://stripe.com/');

    const valid2 = validateUrlSafety('github.com');
    expect(valid2.isValid).toBe(true);
    expect(valid2.cleanUrl).toBe('https://github.com/');

    const valid3 = validateUrlSafety('https://example.com/subpath?query=1');
    expect(valid3.isValid).toBe(true);
    expect(valid3.cleanUrl).toBe('https://example.com/subpath');
  });

  it('blocks localhost and loopback IP addresses (SSRF Protection)', () => {
    const res1 = validateUrlSafety('http://localhost:8080');
    expect(res1.isValid).toBe(false);
    expect(res1.error).toContain('private or reserved');

    const res2 = validateUrlSafety('http://127.0.0.1');
    expect(res2.isValid).toBe(false);
    expect(res2.error).toContain('private or reserved');

    const res3 = validateUrlSafety('http://127.0.0.5:9000');
    expect(res3.isValid).toBe(false);
    expect(res3.error).toContain('private or reserved');
  });

  it('blocks RFC 1918 private subnets and internal names', () => {
    // 10.0.0.0/8
    const r1 = validateUrlSafety('http://10.0.1.5');
    expect(r1.isValid).toBe(false);

    // 192.168.0.0/16
    const r2 = validateUrlSafety('http://192.168.1.100');
    expect(r2.isValid).toBe(false);

    // 172.16.0.0/12
    const r3 = validateUrlSafety('http://172.20.0.1');
    expect(r3.isValid).toBe(false);

    // Internal domains
    const r4 = validateUrlSafety('http://app.internal');
    expect(r4.isValid).toBe(false);
  });

  it('blocks cloud metadata endpoint 169.254.169.254', () => {
    const res = validateUrlSafety('http://169.254.169.254/latest/meta-data/');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('private or reserved');
  });

  it('rejects unsupported protocols like file:// or ftp://', () => {
    const res1 = validateUrlSafety('file:///etc/passwd');
    expect(res1.isValid).toBe(false);

    const res2 = validateUrlSafety('ftp://files.example.com');
    expect(res2.isValid).toBe(false);
  });
});

describe('StackLens Technology Detection & Evidence Engine', () => {
  it('correctly detects Next.js, Cloudflare, React, and Stripe from public signals', () => {
    const stripeInput = PRESET_SITES[0].rawInput;
    const result = performSafeAnalysis(stripeInput);

    expect(result.status).toBe('COMPLETED');
    expect(result.technologies.length).toBeGreaterThan(3);

    const techNames = result.technologies.map((t) => t.name);
    expect(techNames).toContain('Next.js');
    expect(techNames).toContain('Cloudflare');
    expect(techNames).toContain('Stripe');

    // Check evidence attachment
    const nextTech = result.technologies.find((t) => t.name === 'Next.js');
    expect(nextTech?.evidence.length).toBeGreaterThan(0);
    expect(nextTech?.confidence).toBeGreaterThanOrEqual(80);
    expect(nextTech?.isObserved).toBe(true);
  });

  it('correctly calculates security audit grades', () => {
    const rawInput: RawScanInput = {
      url: 'https://secure-bank.example.com',
      headers: {
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'content-security-policy': "default-src 'self'",
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
      },
      html: '<html><head><title>Secure Bank</title></head><body><div id="root"></div></body></html>',
      scripts: [],
      cookies: ['token=xyz; Secure; HttpOnly; SameSite=Strict'],
    };

    const result = performSafeAnalysis(rawInput);
    expect(result.security.hasHsts).toBe(true);
    expect(result.security.hasCsp).toBe(true);
    expect(result.security.hasXFrameOptions).toBe(true);
    expect(result.security.overallScore).toBeGreaterThanOrEqual(85);
    expect(['A+', 'A']).toContain(result.security.securityGrade);
  });
});

describe('StackLens Architecture Inference DAG & Blueprint Generator', () => {
  it('infers multi-tier architecture with observed and inferred components', () => {
    const stripeInput = PRESET_SITES[0].rawInput;
    const scan = performSafeAnalysis(stripeInput);

    expect(scan.architecture.nodes.length).toBeGreaterThanOrEqual(6);

    const clientNode = scan.architecture.nodes.find((n) => n.id === 'node-client');
    const cdnNode = scan.architecture.nodes.find((n) => n.id === 'node-cdn');
    const dbNode = scan.architecture.nodes.find((n) => n.id === 'node-db');

    expect(clientNode).toBeDefined();
    expect(cdnNode).toBeDefined();
    expect(dbNode).toBeDefined();

    // Database is inferred
    expect(dbNode?.isObserved).toBe(false);
    expect(dbNode?.confidence).toBeGreaterThanOrEqual(60);

    // CDN is observed
    expect(cdnNode?.isObserved).toBe(true);
  });

  it('generates complete engineering blueprint with SQL schema and API endpoints', () => {
    const stripeInput = PRESET_SITES[0].rawInput;
    const scan = performSafeAnalysis(stripeInput);

    expect(scan.blueprint.databaseEntities.length).toBeGreaterThan(2);
    expect(scan.blueprint.apiEndpoints.length).toBeGreaterThan(2);
    expect(scan.blueprint.implementationPhases.length).toBe(4);

    // Verify SQL entities
    const usersTable = scan.blueprint.databaseEntities.find((e) => e.name === 'users');
    expect(usersTable).toBeDefined();
    expect(usersTable?.fields.some((f) => f.name === 'id' && f.isPrimary)).toBe(true);
    expect(usersTable?.fields.some((f) => f.name === 'email')).toBe(true);

    // Verify API Endpoints
    const loginEndpoint = scan.blueprint.apiEndpoints.find((ep) => ep.path.includes('/login'));
    expect(loginEndpoint).toBeDefined();
    expect(loginEndpoint?.method).toBe('POST');
  });
});

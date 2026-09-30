import { ArchitectureDiagram, ArchitectureEdge, ArchitectureNode, Technology } from '../types';

export function inferArchitecture(
  technologies: Technology[],
  domain: string,
  stats: { isSsr: boolean; isSpa: boolean }
): ArchitectureDiagram {
  const nodes: ArchitectureNode[] = [];
  const edges: ArchitectureEdge[] = [];

  // Helper to find tech
  const findTech = (category: string) => technologies.find((t) => t.category === category);
  const findTechByName = (name: string) => technologies.find((t) => t.name.toLowerCase() === name.toLowerCase());

  const cdnTech = findTech('CDN & Edge Network');
  const frontendTech = findTech('Frontend Framework') || technologies.find((t) => t.category === 'CMS & Static Site');
  const cloudTech = findTech('Cloud & Hosting');
  const backendTech = findTech('Backend Framework');
  const authTech = findTech('Authentication & Identity');
  const paymentTech = findTech('Payment & E-Commerce');
  const analyticsTech = findTech('Analytics & Observability');

  // Tier 1: Client
  nodes.push({
    id: 'node-client',
    label: 'End User / Browser',
    category: 'client',
    sublabel: 'HTTPS / HTTP3 Client',
    isObserved: true,
    confidence: 100,
    techName: 'Web Browser / Client',
    icon: '💻',
    role: 'Initiates HTTP requests, parses DOM, executes React bundles, and handles client-side state.',
    evidenceSummary: 'Direct inbound connection from web client.',
    alternatives: ['Mobile App (iOS/Android)', 'CLI / Desktop App', 'API SDK'],
    position: { x: 50, y: 220 },
  });

  // Tier 2: CDN / Edge
  const cdnName = cdnTech ? cdnTech.name : cloudTech ? `${cloudTech.name} Edge` : 'Global CDN Edge';
  nodes.push({
    id: 'node-cdn',
    label: cdnName,
    category: 'cdn',
    sublabel: 'Edge Caching & WAF',
    isObserved: Boolean(cdnTech),
    confidence: cdnTech ? cdnTech.confidence : 80,
    techName: cdnName,
    icon: cdnTech ? cdnTech.icon : '☁️',
    role: 'Terminates TLS, provides DDoS mitigation, serves cached static assets at edge POPs, and routes dynamic traffic.',
    evidenceSummary: cdnTech
      ? `Observed via HTTP response headers and DNS CNAME (${cdnTech.evidence.map((e) => e.source).join(', ')})`
      : 'Inferred standard edge routing pattern for high-availability web applications.',
    alternatives: ['Cloudflare', 'Fastly', 'AWS CloudFront', 'Akamai'],
    position: { x: 260, y: 220 },
  });

  edges.push({
    id: 'edge-client-cdn',
    source: 'node-client',
    target: 'node-cdn',
    label: 'HTTPS / TLS 1.3',
    protocol: 'HTTPS',
    animated: true,
  });

  // Tier 3: Frontend / SSR Layer
  const feName = frontendTech ? frontendTech.name : 'React / Modern UI';
  nodes.push({
    id: 'node-frontend',
    label: feName,
    category: 'frontend',
    sublabel: stats.isSsr ? 'SSR & Static Generation' : 'Single Page App (SPA)',
    isObserved: Boolean(frontendTech),
    confidence: frontendTech ? frontendTech.confidence : 75,
    techName: feName,
    icon: frontendTech ? frontendTech.icon : '⚛️',
    role: stats.isSsr
      ? 'Executes server components, renders initial HTML markup on edge/node runtime, and hydrates client interactivity.'
      : 'Serves client bundles, client-side routing, virtual DOM rendering, and user state management.',
    evidenceSummary: frontendTech
      ? `Observed from JavaScript bundle signatures, DOM root tags, and meta generators.`
      : 'Inferred standard frontend presentation layer.',
    alternatives: ['Next.js', 'Remix', 'Nuxt.js', 'SvelteKit'],
    position: { x: 480, y: 140 },
  });

  edges.push({
    id: 'edge-cdn-fe',
    source: 'node-cdn',
    target: 'node-frontend',
    label: 'Asset / Page Request',
    protocol: 'HTTPS',
    animated: true,
  });

  // Tier 4: API Gateway / BFF
  const apiLabel = backendTech ? `${backendTech.name} API Gateway` : stats.isSsr ? 'BFF / Route Handlers' : 'API Gateway';
  nodes.push({
    id: 'node-api',
    label: apiLabel,
    category: 'api',
    sublabel: 'RESTful / JSON Gateway',
    isObserved: Boolean(backendTech),
    confidence: backendTech ? backendTech.confidence : 70,
    techName: apiLabel,
    icon: '⚡',
    role: 'Authenticates tokens, rate limits client requests, orchestrates backend microservices, and validates payloads.',
    evidenceSummary: backendTech
      ? `Observed via backend fingerprint headers and session cookies.`
      : 'Inferred API aggregation and backend-for-frontend layer.',
    alternatives: ['Spring Cloud Gateway', 'Kong Gateway', 'Fastify / Express API', 'GraphQL Yoga'],
    position: { x: 480, y: 320 },
  });

  edges.push({
    id: 'edge-cdn-api',
    source: 'node-cdn',
    target: 'node-api',
    label: '/api/* JSON Proxy',
    protocol: 'HTTPS',
    animated: true,
  });

  edges.push({
    id: 'edge-fe-api',
    source: 'node-frontend',
    target: 'node-api',
    label: 'Client Data Fetch',
    protocol: 'HTTPS',
    animated: false,
  });

  // Tier 5: Core Backend Services
  const beName = backendTech ? backendTech.name : 'Core Backend Microservices (Spring Boot / Node)';
  nodes.push({
    id: 'node-backend',
    label: beName,
    category: 'backend',
    sublabel: 'Domain Business Logic',
    isObserved: Boolean(backendTech),
    confidence: backendTech ? backendTech.confidence : 65,
    techName: beName,
    icon: backendTech ? backendTech.icon : '🍃',
    role: 'Executes domain transactional logic, database transactions, webhook processing, and business rules.',
    evidenceSummary: backendTech
      ? `Observed via backend cookies (${backendTech.evidence.map((e) => e.sampleValue).join(', ')})`
      : 'Inferred private microservice backend (not directly exposed externally for security).',
    alternatives: ['Spring Boot (Java)', 'NestJS (TypeScript)', 'Go (Gin/Fiber)', 'FastAPI (Python)'],
    position: { x: 700, y: 220 },
  });

  edges.push({
    id: 'edge-api-backend',
    source: 'node-api',
    target: 'node-backend',
    label: 'RPC / Internal HTTP',
    protocol: 'INTERNAL',
    animated: true,
  });

  // Tier 6: Primary Database
  const dbTech = findTech('Database (Observed/Inferred)');
  const dbName = dbTech ? dbTech.name : 'PostgreSQL Database';
  nodes.push({
    id: 'node-db',
    label: dbName,
    category: 'database',
    sublabel: 'Primary ACID Data Store',
    isObserved: Boolean(dbTech),
    confidence: dbTech ? dbTech.confidence : 75,
    techName: dbName,
    icon: '🐘',
    role: 'Stores persistent application state, relational schema, user records, and transactional audit trails.',
    evidenceSummary: dbTech
      ? `Observed in client bundle / BaaS integration.`
      : 'Inferred relational persistence layer based on typical high-scale architectural conventions.',
    alternatives: ['PostgreSQL', 'MySQL / PlanetScale', 'MongoDB Atlas', 'CockroachDB'],
    position: { x: 920, y: 120 },
  });

  edges.push({
    id: 'edge-backend-db',
    source: 'node-backend',
    target: 'node-db',
    label: 'SQL / JDBC (Port 5432)',
    protocol: 'TCP',
    animated: false,
  });

  // Tier 7: Caching & Fast In-Memory
  const cacheTech = findTech('Cache & In-Memory');
  const cacheName = cacheTech ? cacheTech.name : 'Redis In-Memory Cache';
  nodes.push({
    id: 'node-cache',
    label: cacheName,
    category: 'cache',
    sublabel: 'Session & Rate Limit Cache',
    isObserved: Boolean(cacheTech),
    confidence: cacheTech ? cacheTech.confidence : 75,
    techName: cacheName,
    icon: '🔴',
    role: 'Accelerates sub-millisecond query caches, distributed locks, rate-limiting tokens, and user session stores.',
    evidenceSummary: cacheTech
      ? `Observed via error trace or SDK headers.`
      : 'Inferred high-throughput caching tier for web scale response times.',
    alternatives: ['Redis', 'Dragonfly', 'Memcached', 'AWS ElastiCache'],
    position: { x: 920, y: 240 },
  });

  edges.push({
    id: 'edge-backend-cache',
    source: 'node-backend',
    target: 'node-cache',
    label: 'GET/SET (Port 6379)',
    protocol: 'TCP',
    animated: false,
  });

  // Tier 8: Message Queue / Workers
  const mqTech = findTech('Message Queue & Async');
  const mqName = mqTech ? mqTech.name : 'RabbitMQ Job Queue';
  nodes.push({
    id: 'node-queue',
    label: mqName,
    category: 'queue',
    sublabel: 'Async Task Pipeline',
    isObserved: Boolean(mqTech),
    confidence: mqTech ? mqTech.confidence : 70,
    techName: mqName,
    icon: '🐇',
    role: 'Buffers asynchronous workloads (email dispatch, report generation, webhooks, media encoding) to prevent API blocking.',
    evidenceSummary: mqTech
      ? `Observed from worker patterns.`
      : 'Inferred asynchronous worker queue for reliable decoupling and spike absorption.',
    alternatives: ['RabbitMQ', 'Apache Kafka', 'AWS SQS', 'BullMQ (Redis)'],
    position: { x: 920, y: 360 },
  });

  edges.push({
    id: 'edge-backend-queue',
    source: 'node-backend',
    target: 'node-queue',
    label: 'AMQP / Events',
    protocol: 'INTERNAL',
    animated: true,
  });

  // Tier 9: 3rd Party External Services
  if (authTech || paymentTech || analyticsTech) {
    const extName = [authTech?.name, paymentTech?.name, analyticsTech?.name].filter(Boolean).join(', ');
    nodes.push({
      id: 'node-external',
      label: 'External SaaS Services',
      category: 'external',
      sublabel: extName || 'Auth & Payments & Analytics',
      isObserved: true,
      confidence: 95,
      techName: extName || 'Third-Party SaaS',
      icon: '🌐',
      role: 'Outsourced specialized capabilities including payment processing, analytics telemetry, and identity auth.',
      evidenceSummary: `Direct client-side or backend SDK telemetry detected for ${extName}.`,
      alternatives: ['Self-hosted equivalents', 'Custom microservices'],
      position: { x: 700, y: 380 },
    });

    edges.push({
      id: 'edge-backend-external',
      source: 'node-backend',
      target: 'node-external',
      label: 'Webhooks / OAuth',
      protocol: 'HTTPS',
      animated: true,
    });
  }

  const patternSummary = stats.isSsr
    ? 'Modern Edge-Rendered SSR with Microservices Backend & Async Queues'
    : 'Decoupled Single Page Application (SPA) with Distributed API Layer & Caching';

  return {
    nodes,
    edges,
    summary: `Architecture inferred for ${domain}: An end-to-end multi-tier pipeline with Edge CDN distribution, ${feName} presentation layer, decoupled ${beName}, high-performance caching via Redis, and ACID PostgreSQL persistence.`,
    pattern: patternSummary,
    tierCount: 5,
  };
}

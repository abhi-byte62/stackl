export type TechCategory =
  | 'Frontend Framework'
  | 'UI Library & Styling'
  | 'State Management'
  | 'Backend Framework'
  | 'Runtime & Language'
  | 'API & Protocols'
  | 'Database (Observed/Inferred)'
  | 'Cache & In-Memory'
  | 'Message Queue & Async'
  | 'CDN & Edge Network'
  | 'Cloud & Hosting'
  | 'Authentication & Identity'
  | 'Analytics & Observability'
  | 'Payment & E-Commerce'
  | 'Security & WAF'
  | 'CMS & Static Site'
  | 'DevOps & CI/CD';

export interface Evidence {
  type: 'HEADER' | 'HTML_TAG' | 'SCRIPT_SRC' | 'COOKIE' | 'DNS_RECORD' | 'TLS_CERT' | 'DOM_SELECTOR' | 'META_TAG' | 'HEURISTIC';
  source: string;
  matchedPattern: string;
  sampleValue: string;
  confidenceWeight: number; // 0 to 100
}

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  version?: string;
  icon: string;
  confidence: number; // 0 to 100
  isObserved: boolean; // true = directly observed in DOM/headers/DNS; false = architectural inference
  description: string;
  evidence: Evidence[];
  websiteUrl?: string;
  alternatives: string[];
  roleInStack: string;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  category: 'client' | 'cdn' | 'frontend' | 'api' | 'backend' | 'database' | 'cache' | 'queue' | 'external' | 'auth';
  sublabel: string;
  isObserved: boolean;
  confidence: number;
  techName: string;
  icon: string;
  role: string;
  evidenceSummary: string;
  alternatives: string[];
  position: NodePosition;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: string;
  animated?: boolean;
}

export interface ArchitectureDiagram {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  summary: string;
  pattern: string; // e.g., 'Jamstack + Edge API', 'Microservices with Message Broker', 'Monolith + CDN'
  tierCount: number;
}

export interface DatabaseField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  description: string;
}

export interface DatabaseEntity {
  name: string;
  description: string;
  estimatedVolume: string;
  fields: DatabaseField[];
  indexes: string[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'WS';
  path: string;
  description: string;
  authRequired: boolean;
  sampleRequest?: string;
  sampleResponse?: string;
}

export interface BlueprintPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  deliverables: string[];
  milestone: string;
}

export interface EngineeringBlueprint {
  overview: string;
  architecturePattern: string;
  targetScale: string;
  recommendedStack: {
    frontend: string;
    backend: string;
    database: string;
    caching: string;
    queue: string;
    infrastructure: string;
    auth: string;
    observability: string;
  };
  databaseEntities: DatabaseEntity[];
  apiEndpoints: ApiEndpoint[];
  authStrategy: {
    method: string;
    flowDescription: string;
    tokenType: string;
    securityMeasures: string[];
  };
  cachingStrategy: {
    cdnTier: string;
    appTier: string;
    databaseTier: string;
    invalidationStrategy: string;
  };
  asyncProcessing: {
    queueSystem: string;
    backgroundJobs: string[];
    concurrencyModel: string;
  };
  implementationPhases: BlueprintPhase[];
  scalabilityConsiderations: string[];
}

export interface SecurityAudit {
  ssrfSafe: boolean;
  tlsVersion: string;
  hasCsp: boolean;
  hasHsts: boolean;
  hasXFrameOptions: boolean;
  hasXContentTypeOptions: boolean;
  serverHeaderLeaked?: string;
  poweredByLeaked?: string;
  cookieSecurityScore: number;
  overallScore: number; // 0 to 100
  securityGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  recommendations: string[];
}

export interface DnsInsight {
  ipAddresses: string[];
  cname?: string;
  nameservers: string[];
  mxRecords: string[];
  txtRecords: string[];
  hostingProvider?: string;
  asn?: string;
  reverseDns?: string;
}

export interface ScanResult {
  id: string;
  targetUrl: string;
  domain: string;
  scannedAt: string;
  scanDurationMs: number;
  status: 'PENDING' | 'SCANNING' | 'ANALYZING' | 'INFERRING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
  technologies: Technology[];
  architecture: ArchitectureDiagram;
  blueprint: EngineeringBlueprint;
  security: SecurityAudit;
  dns: DnsInsight;
  rawHeaders: Record<string, string>;
  detectedScripts: string[];
  cookiesFound: string[];
  htmlStats: {
    title: string;
    metaTagsCount: number;
    scriptTagsCount: number;
    stylesheetCount: number;
    hasServiceWorker: boolean;
    isSpa: boolean;
    isSsr: boolean;
  };
}

export interface ScanComparison {
  scanA: ScanResult;
  scanB: ScanResult;
  commonTechnologies: Technology[];
  onlyInA: Technology[];
  onlyInB: Technology[];
  architectureDiff: {
    nodesAOnly: string[];
    nodesBOnly: string[];
    samePatterns: boolean;
  };
  securityComparison: {
    scoreDiff: number;
    gradeA: string;
    gradeB: string;
  };
}

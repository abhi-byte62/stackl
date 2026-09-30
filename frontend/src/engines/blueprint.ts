import { ArchitectureDiagram, DatabaseEntity, EngineeringBlueprint, Technology } from '../types';

export function generateBlueprint(
  domain: string,
  technologies: Technology[],
  architecture: ArchitectureDiagram,
  stats: { isSsr: boolean }
): EngineeringBlueprint {
  const feTech = technologies.find((t) => t.category === 'Frontend Framework')?.name || 'React 19 with Vite & TypeScript';
  const beTech = technologies.find((t) => t.category === 'Backend Framework')?.name || 'Spring Boot 3.3 (Java 21) & Node.js';
  const cdnTech = technologies.find((t) => t.category === 'CDN & Edge Network')?.name || 'Cloudflare Enterprise';
  const authTech = technologies.find((t) => t.category === 'Authentication & Identity')?.name || 'Clerk / OAuth2 JWT';
  const dbTech = 'PostgreSQL 16 with pgvector & Read Replicas';
  const cacheTech = 'Redis 7.2 (Distributed Cache & Rate Limiting)';
  const queueTech = 'RabbitMQ 3.13 (AMQP Asynchronous Worker Pipeline)';

  const cleanDomain = domain.replace(/^www\./, '').split('.')[0];
  const capitalizedName = cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);

  const databaseEntities: DatabaseEntity[] = [
    {
      name: 'users',
      description: 'Stores core user accounts, credentials, MFA flags, and role-based permissions.',
      estimatedVolume: '100k - 1M rows',
      fields: [
        { name: 'id', type: 'UUID', isPrimary: true, description: 'Primary Key (v7 time-ordered UUID)' },
        { name: 'email', type: 'VARCHAR(255)', description: 'Unique normalized email address' },
        { name: 'password_hash', type: 'VARCHAR(255)', description: 'Argon2id or bcrypt hash' },
        { name: 'full_name', type: 'VARCHAR(150)', description: 'User display name' },
        { name: 'role', type: 'VARCHAR(50)', description: 'ENUM (ADMIN, MEMBER, VIEWER)' },
        { name: 'is_verified', type: 'BOOLEAN', description: 'Email verification status' },
        { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp of registration' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Timestamp of last modification' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_users_email ON users(email);', 'CREATE INDEX idx_users_created_at ON users(created_at);'],
    },
    {
      name: 'organizations',
      description: 'Multi-tenant organization boundary managing team members, billing, and API quotas.',
      estimatedVolume: '10k - 100k rows',
      fields: [
        { name: 'id', type: 'UUID', isPrimary: true, description: 'Organization identifier' },
        { name: 'name', type: 'VARCHAR(100)', description: 'Organization workspace name' },
        { name: 'slug', type: 'VARCHAR(100)', description: 'URL-friendly unique handle' },
        { name: 'plan_tier', type: 'VARCHAR(50)', description: 'Subscription tier (FREE, PRO, ENTERPRISE)' },
        { name: 'stripe_customer_id', type: 'VARCHAR(100)', description: 'Linked Stripe customer token' },
        { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation timestamp' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_orgs_slug ON organizations(slug);'],
    },
    {
      name: 'organization_members',
      description: 'Join table for multi-tenant RBAC permissions mapping users to workspaces.',
      estimatedVolume: '200k - 2M rows',
      fields: [
        { name: 'id', type: 'UUID', isPrimary: true, description: 'Membership primary key' },
        { name: 'organization_id', type: 'UUID', isForeign: true, references: 'organizations(id)', description: 'Parent org' },
        { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'Target user' },
        { name: 'role', type: 'VARCHAR(50)', description: 'Role within organization' },
        { name: 'joined_at', type: 'TIMESTAMPTZ', description: 'Membership timestamp' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_org_user ON organization_members(organization_id, user_id);'],
    },
    {
      name: 'projects_or_resources',
      description: `Primary application resources belonging to an organization in ${capitalizedName}.`,
      estimatedVolume: '500k - 5M rows',
      fields: [
        { name: 'id', type: 'UUID', isPrimary: true, description: 'Resource primary key' },
        { name: 'organization_id', type: 'UUID', isForeign: true, references: 'organizations(id)', description: 'Owner organization' },
        { name: 'name', type: 'VARCHAR(200)', description: 'Resource display name' },
        { name: 'status', type: 'VARCHAR(50)', description: 'Status (ACTIVE, ARCHIVED, PROCESSING)' },
        { name: 'metadata', type: 'JSONB', description: 'Flexible schemaless attributes & configurations' },
        { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation date' },
      ],
      indexes: [
        'CREATE INDEX idx_resources_org_status ON projects_or_resources(organization_id, status);',
        'CREATE INDEX idx_resources_metadata_gin ON projects_or_resources USING gin (metadata);',
      ],
    },
    {
      name: 'audit_logs',
      description: 'Immutable append-only compliance audit trail recording all critical mutations.',
      estimatedVolume: '10M - 50M rows (Partitioned)',
      fields: [
        { name: 'id', type: 'BIGSERIAL', isPrimary: true, description: 'Sequential audit log ID' },
        { name: 'organization_id', type: 'UUID', description: 'Organization boundary' },
        { name: 'actor_id', type: 'UUID', description: 'User or Service Account ID' },
        { name: 'action', type: 'VARCHAR(100)', description: 'Action key (e.g., project.created, user.invited)' },
        { name: 'ip_address', type: 'INET', description: 'Client IP address' },
        { name: 'payload_diff', type: 'JSONB', description: 'Old state vs new state change diff' },
        { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Event timestamp (Partition key)' },
      ],
      indexes: ['CREATE INDEX idx_audit_org_time ON audit_logs(organization_id, created_at DESC);'],
    },
  ];

  return {
    overview: `This engineering blueprint outlines the production-ready architecture required to build a modern, high-throughput system like ${domain}. It utilizes an asynchronous event-driven design, a low-latency edge caching layer, and transactional database guarantees.`,
    architecturePattern: architecture.pattern,
    targetScale: 'Capable of serving 100,000+ Daily Active Users (DAU) with < 100ms P95 API response times and 99.99% availability.',
    recommendedStack: {
      frontend: `${feTech} + Tailwind CSS + Lucide Icons`,
      backend: `${beTech} (Spring Boot 3.3 / Node.js Microservices)`,
      database: dbTech,
      caching: cacheTech,
      queue: queueTech,
      infrastructure: `${cdnTech} + Docker / Kubernetes + AWS ECS / Cloud Run`,
      auth: authTech,
      observability: 'OpenTelemetry + Prometheus + Grafana + Sentry',
    },
    databaseEntities,
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/login',
        description: 'Authenticates credentials, issues HttpOnly JWT session cookie, and returns user profile.',
        authRequired: false,
        sampleRequest: '{\n  "email": "developer@company.com",\n  "password": "SecurePassword123!"\n}',
        sampleResponse: '{\n  "status": "success",\n  "user": {\n    "id": "usr_99a8b7c6",\n    "name": "Jane Doe",\n    "email": "developer@company.com"\n  },\n  "expiresIn": 86400\n}',
      },
      {
        method: 'GET',
        path: '/api/v1/organizations/current',
        description: 'Fetches active tenant organization profile, subscription status, and member count.',
        authRequired: true,
        sampleResponse: '{\n  "id": "org_112233",\n  "name": "Acme Corp",\n  "planTier": "PRO",\n  "rateLimitQuota": 10000\n}',
      },
      {
        method: 'POST',
        path: '/api/v1/resources',
        description: 'Creates a new core resource entity and enqueues an asynchronous processing job.',
        authRequired: true,
        sampleRequest: '{\n  "name": "Production Cluster",\n  "config": { "region": "us-east-1", "replicas": 3 }\n}',
        sampleResponse: '{\n  "id": "res_883300",\n  "status": "PROCESSING",\n  "jobId": "job_queue_5544"\n}',
      },
      {
        method: 'GET',
        path: '/api/v1/resources/:id/status',
        description: 'Real-time polling or WebSocket endpoint to stream worker execution progress.',
        authRequired: true,
        sampleResponse: '{\n  "id": "res_883300",\n  "progress": 100,\n  "status": "COMPLETED",\n  "completedAt": "2026-09-30T10:45:00Z"\n}',
      },
      {
        method: 'POST',
        path: '/api/v1/webhooks/stripe',
        description: 'Receives and verifies Stripe webhook signatures for invoice payment success and cancellations.',
        authRequired: false,
        sampleRequest: '{\n  "type": "invoice.payment_succeeded",\n  "data": { "customer": "cus_9933" }\n}',
        sampleResponse: '{\n  "received": true\n}',
      },
    ],
    authStrategy: {
      method: 'OAuth2 / OpenID Connect with RS256 Asymmetric JWT Tokens',
      flowDescription:
        'Clients authenticate via OAuth2 authorization code flow with PKCE. The backend issues short-lived (15-minute) JWT access tokens in memory and long-lived (30-day) refresh tokens stored in HttpOnly, Secure, SameSite=Strict cookies. Redis is used for immediate token revocation lists.',
      tokenType: 'Bearer JWT (RS256 signed with JWKS public key rotation)',
      securityMeasures: [
        'HttpOnly, Secure, SameSite=Strict cookie flags preventing XSS token theft',
        'Automatic CSRF Double-Submit Cookie verification on state-modifying requests',
        'Argon2id password hashing with custom salt and work factor',
        'Brute-force lockout and IP sliding-window rate limiting via Redis',
        'Optional WebAuthn / FIDO2 Passkeys and TOTP Multi-Factor Authentication',
      ],
    },
    cachingStrategy: {
      cdnTier:
        'Cloudflare / Fastly CDN edge caching for all static assets (immutable 1-year max-age) and stale-while-revalidate for dynamic SSR pages.',
      appTier:
        'Redis Cluster caching hot entity reads (TTL 5m - 1hr), user session claims, and sliding-window rate limit counters.',
      databaseTier:
        'PostgreSQL connection pooling via PgBouncer, shared buffer cache, and dedicated Read Replicas for reporting queries.',
      invalidationStrategy:
        'Event-driven cache invalidation: Backend publishes entity update events to Redis Pub/Sub, triggering instant cache purges by key prefix (e.g. org:123:*).',
    },
    asyncProcessing: {
      queueSystem: 'RabbitMQ with AMQP topic exchanges and dedicated worker pools',
      backgroundJobs: [
        'Asynchronous website crawling and security scanning',
        'Transactional email notifications and Slack webhook alerts',
        'PDF and CSV report compilation and image resizing',
        'Stripe billing invoice synchronization and automated renewal checks',
      ],
      concurrencyModel:
        'Worker processes consume from RabbitMQ with prefetch count = 10, utilizing backoff retries (3 attempts) before forwarding to a Dead-Letter Queue (DLQ).',
    },
    implementationPhases: [
      {
        phaseNumber: 1,
        title: 'MVP & Core Foundation',
        duration: 'Weeks 1 – 4',
        deliverables: [
          'Setup PostgreSQL schema with Flyway migrations & PgBouncer',
          'Implement Spring Boot / Node REST API with JWT authentication & RBAC',
          'Scaffold React + TypeScript Vite frontend with Tailwind design system',
          'Configure Docker Compose for local full-stack reproducible development',
        ],
        milestone: 'Functional end-to-end user signup, workspace creation, and CRUD operations.',
      },
      {
        phaseNumber: 2,
        title: 'Asynchronous Worker Pipeline & Engines',
        duration: 'Weeks 5 – 8',
        deliverables: [
          'Deploy RabbitMQ message broker with worker consumer pools',
          'Build safe scanning engine with SSRF validation and IP blocklists',
          'Implement technology fingerprint detection with 200+ rule signatures',
          'Add Redis caching for rate limiting and fast job status polling',
        ],
        milestone: 'Asynchronous job queue processing live scans with real-time status reporting.',
      },
      {
        phaseNumber: 3,
        title: 'Intelligence, Diagrams & Blueprints',
        duration: 'Weeks 9 – 12',
        deliverables: [
          'Build Architecture Inference Engine converting tech data into interactive DAGs',
          'Implement Build-from-Scratch Blueprint Generator with SQL schemas & API specs',
          'Add historical scan comparisons and fingerprint diffing view',
          'Export blueprints to PDF, Markdown, and JSON formats',
        ],
        milestone: 'Interactive architecture visualization and automated architectural blueprints.',
      },
      {
        phaseNumber: 4,
        title: 'Production Hardening & Scale',
        duration: 'Weeks 13 – 16',
        deliverables: [
          'Configure Cloudflare CDN with WAF, DDoS protection, and SSL termination',
          'Deploy to AWS / Kubernetes with multi-AZ read replicas & auto-scaling groups',
          'Integrate Stripe subscription billing and usage-based metering',
          'Setup OpenTelemetry distributed tracing and Prometheus/Grafana alerts',
        ],
        milestone: 'Production launch with 99.99% SLA readiness and enterprise security compliance.',
      },
    ],
    scalabilityConsiderations: [
      'Database Connection Pooling: Use PgBouncer in transaction pooling mode to handle thousands of concurrent API requests without exhausting database backend threads.',
      'Horizontal API Scaling: Stateless Spring Boot / Express containers auto-scaled based on CPU utilization (>70%) behind AWS ALB or NGINX.',
      'Database Read Replicas: Direct analytical and read-heavy queries to PostgreSQL read replicas to preserve primary write IOPS.',
      'SSRF Protection: Enforce strict DNS-resolution checking before socket connection to prevent DNS rebinding and private cloud metadata access (169.254.169.254).',
      'Graceful Degradation: Implement Circuit Breaker patterns (Resilience4j) on external API integrations (Stripe, DNS resolvers) with fallback caches.',
    ],
  };
}

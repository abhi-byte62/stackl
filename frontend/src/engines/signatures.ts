import { TechCategory } from '../types';

export interface TechSignature {
  id: string;
  name: string;
  category: TechCategory;
  icon: string; // Icon identifier
  description: string;
  roleInStack: string;
  alternatives: string[];
  websiteUrl: string;
  rules: {
    headers?: { [headerName: string]: RegExp | string };
    meta?: { [metaName: string]: RegExp | string };
    scripts?: RegExp[];
    cookies?: RegExp[];
    html?: RegExp[];
    dnsCname?: RegExp[];
    dnsTxt?: RegExp[];
    jsVars?: string[];
  };
}

export const TECHNOLOGY_SIGNATURES: TechSignature[] = [
  // --- FRONTEND FRAMEWORKS & SSG/SSR ---
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend Framework',
    icon: 'layers',
    description: 'React framework by Vercel offering hybrid static, server-side rendering, and server actions.',
    roleInStack: 'Full-stack React runtime handling SSR, edge routing, image optimization, and BFF data loaders.',
    alternatives: ['Remix', 'Nuxt.js', 'Astro', 'SvelteKit'],
    websiteUrl: 'https://nextjs.org',
    rules: {
      headers: { 'x-powered-by': /Next\.js/i },
      meta: { generator: /Next\.js/i },
      scripts: [/_next\/static\//i, /next-client-pages/i, /next\/dist\//i],
      html: [/__NEXT_DATA__/i, /id="__next"/i, /next-route-announcer/i],
    },
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend Framework',
    icon: 'code',
    description: 'Component-based JavaScript library for declarative user interfaces developed by Meta.',
    roleInStack: 'Core declarative UI component tree and virtual DOM reconciliation engine.',
    alternatives: ['Vue.js', 'Svelte', 'Preact', 'SolidJS'],
    websiteUrl: 'https://react.dev',
    rules: {
      scripts: [/react(\.production|\.development)?\.js/i, /react-dom/i, /_react/i],
      html: [/data-reactroot/i, /data-reactid/i, /data-react-helmet/i],
      jsVars: ['React', 'ReactDOM'],
    },
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'Frontend Framework',
    icon: 'code',
    description: 'Progressive JavaScript framework for building modern web user interfaces.',
    roleInStack: 'Reactivity system, single-file components, and template compilation layer.',
    alternatives: ['React', 'Svelte', 'Angular'],
    websiteUrl: 'https://vuejs.org',
    rules: {
      scripts: [/vue(\.runtime|\.min|\.esm)?\.js/i, /vuejs/i],
      html: [/data-v-[a-f0-9]{6,8}/i, /v-cloak/i, /id="app"/i],
      jsVars: ['Vue'],
    },
  },
  {
    id: 'nuxt',
    name: 'Nuxt.js',
    category: 'Frontend Framework',
    icon: 'layers',
    description: 'Universal Vue framework for server-side rendering and static site generation.',
    roleInStack: 'Vue-based SSR, static pre-rendering, and automatic file-based routing architecture.',
    alternatives: ['Next.js', 'SvelteKit', 'Remix'],
    websiteUrl: 'https://nuxt.com',
    rules: {
      headers: { 'x-powered-by': /Nuxt/i },
      html: [/__NUXT__/i, /id="__nuxt"/i],
      scripts: [/_nuxt\//i],
    },
  },
  {
    id: 'svelte',
    name: 'Svelte',
    category: 'Frontend Framework',
    icon: 'code',
    description: 'Compile-time UI framework compiling components into highly efficient imperative code.',
    roleInStack: 'Zero-overhead compiled UI components with surgically precise DOM updates.',
    alternatives: ['SolidJS', 'Vue.js', 'React'],
    websiteUrl: 'https://svelte.dev',
    rules: {
      html: [/class="svelte-[a-z0-9]+"/i, /svelte-announcer/i],
      scripts: [/svelte/i],
    },
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'CMS & Static Site',
    icon: 'layers',
    description: 'Content-driven web framework utilizing partial hydration Islands architecture.',
    roleInStack: 'Zero-JS by default static site generator with selective client hydration.',
    alternatives: ['Next.js', 'Gatsby', 'Hugo', '11ty'],
    websiteUrl: 'https://astro.build',
    rules: {
      meta: { generator: /Astro/i },
      html: [/astro-island/i, /data-astro-cid/i],
      scripts: [/astro\//i],
    },
  },
  {
    id: 'remix',
    name: 'Remix',
    category: 'Frontend Framework',
    icon: 'layers',
    description: 'Full-stack web framework focused on web standards, nested routing, and fast UX.',
    roleInStack: 'Server-side rendering, nested routes, and data mutations using web standard fetch APIs.',
    alternatives: ['Next.js', 'React Router v7', 'Nuxt'],
    websiteUrl: 'https://remix.run',
    rules: {
      html: [/window\.__remixContext/i, /remix-island/i],
      scripts: [/\/build\/root-[a-f0-9]+\.js/i],
    },
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'Frontend Framework',
    icon: 'layers',
    description: 'Enterprise-grade TypeScript web application platform maintained by Google.',
    roleInStack: 'Structured frontend platform with dependency injection, RxJS streams, and typed templates.',
    alternatives: ['React', 'Vue.js'],
    websiteUrl: 'https://angular.dev',
    rules: {
      html: [/ng-version=/i, /_nghost-/i, /_ngcontent-/i, /ng-app/i],
      scripts: [/angular(\.min)?\.js/i, /main\.[a-f0-9]{16,20}\.js/i],
    },
  },
  {
    id: 'htmx',
    name: 'HTMX',
    category: 'UI Library & Styling',
    icon: 'code',
    description: 'Hypermedia-driven dynamic frontend without heavy client-side JavaScript bundles.',
    roleInStack: 'Extends HTML to execute AJAX, WebSockets, and SSE directly from attributes.',
    alternatives: ['Hotwire (Turbo)', 'Alpine.js', 'React'],
    websiteUrl: 'https://htmx.org',
    rules: {
      html: [/hx-get=/i, /hx-post=/i, /hx-target=/i, /hx-swap=/i, /hx-trigger=/i],
      scripts: [/htmx(\.min)?\.js/i],
    },
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'UI Library & Styling',
    icon: 'code',
    description: 'Utility-first CSS framework for composing design systems directly in markup.',
    roleInStack: 'Atomic design system and utility-based styling layer.',
    alternatives: ['CSS Modules', 'Styled Components', 'Bootstrap'],
    websiteUrl: 'https://tailwindcss.com',
    rules: {
      html: [/class="[^"]*(?:flex|grid|items-center|justify-between|bg-slate-|text-sm|rounded-lg)[^"]*"/i],
      scripts: [/tailwind/i],
    },
  },

  // --- CDNS, EDGE & INFRASTRUCTURE ---
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'CDN & Edge Network',
    icon: 'globe',
    description: 'Global cloud edge platform delivering caching, DDoS mitigation, DNS, and serverless compute.',
    roleInStack: 'Edge reverse-proxy, global CDN, TLS termination, and WAF security perimeter.',
    alternatives: ['Fastly', 'AWS CloudFront', 'Akamai'],
    websiteUrl: 'https://cloudflare.com',
    rules: {
      headers: {
        server: /cloudflare/i,
        'cf-ray': /.+/,
        'cf-cache-status': /.+/,
      },
      dnsCname: [/cloudflare\.net/i, /cloudflare\.com/i],
      dnsTxt: [/cloudflare-verify/i],
    },
  },
  {
    id: 'fastly',
    name: 'Fastly',
    category: 'CDN & Edge Network',
    icon: 'globe',
    description: 'Programmable edge cloud platform for content delivery and edge compute.',
    roleInStack: 'Edge caching layer with instant cache purges and VCL/Wasm edge compute.',
    alternatives: ['Cloudflare', 'CloudFront', 'Akamai'],
    websiteUrl: 'https://fastly.com',
    rules: {
      headers: {
        'x-served-by': /cache-/i,
        'fastly-restarts': /.+/,
        'x-fastly-request-id': /.+/,
      },
    },
  },
  {
    id: 'aws-cloudfront',
    name: 'AWS CloudFront',
    category: 'CDN & Edge Network',
    icon: 'globe',
    description: 'Amazon Web Services global content delivery network service.',
    roleInStack: 'Edge distribution layer caching static assets and routing dynamic requests to AWS origins.',
    alternatives: ['Cloudflare', 'Fastly'],
    websiteUrl: 'https://aws.amazon.com/cloudfront/',
    rules: {
      headers: {
        'x-amz-cf-id': /.+/,
        'x-amz-cf-pop': /.+/,
        via: /CloudFront/i,
      },
      dnsCname: [/cloudfront\.net/i],
    },
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Cloud & Hosting',
    icon: 'server',
    description: 'Frontend cloud platform with serverless edge compute and CI/CD pipelines.',
    roleInStack: 'Edge hosting, serverless function compute, and Next.js deployment runtime.',
    alternatives: ['Netlify', 'AWS Amplify', 'Render'],
    websiteUrl: 'https://vercel.com',
    rules: {
      headers: {
        'x-vercel-id': /.+/,
        server: /Vercel/i,
        'x-vercel-cache': /.+/,
      },
      dnsCname: [/vercel-dns\.com/i, /vercel\.app/i],
    },
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'Cloud & Hosting',
    icon: 'server',
    description: 'Web development platform for continuous builds, serverless functions, and edge routing.',
    roleInStack: 'Static site hosting, edge middleware, and serverless lambdas.',
    alternatives: ['Vercel', 'Cloudflare Pages'],
    websiteUrl: 'https://netlify.com',
    rules: {
      headers: {
        'x-nf-request-id': /.+/,
        server: /Netlify/i,
      },
      dnsCname: [/netlify\.app/i, /netlify\.com/i],
    },
  },
  {
    id: 'aws-s3',
    name: 'Amazon S3',
    category: 'Cloud & Hosting',
    icon: 'database',
    description: 'Scalable cloud object storage service for storing static assets and media files.',
    roleInStack: 'Static asset storage, user uploads repository, and build artifact host.',
    alternatives: ['Google Cloud Storage', 'Cloudflare R2'],
    websiteUrl: 'https://aws.amazon.com/s3/',
    rules: {
      headers: {
        'x-amz-request-id': /.+/,
        'x-amz-id-2': /.+/,
        server: /AmazonS3/i,
      },
      dnsCname: [/s3\.amazonaws\.com/i, /s3-website/i],
    },
  },

  // --- BACKEND FRAMEWORKS & APIS ---
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'Backend Framework',
    icon: 'server',
    description: 'Enterprise Java framework for building robust, production-grade microservices and APIs.',
    roleInStack: 'Core business logic layer, REST/gRPC endpoints, security filters, and JPA data access.',
    alternatives: ['Quarkus', 'Micronaut', 'NestJS', 'Go (Gin)'],
    websiteUrl: 'https://spring.io/projects/spring-boot',
    rules: {
      headers: {
        'x-application-context': /.+/,
      },
      cookies: [/JSESSIONID/i],
      html: [/whitelabel-error-page/i, /Whitelabel Error Page/i],
    },
  },
  {
    id: 'express',
    name: 'Node.js / Express',
    category: 'Backend Framework',
    icon: 'server',
    description: 'Fast, minimalist web framework for Node.js server runtimes.',
    roleInStack: 'API gateway, middleware routing, and microservice backend.',
    alternatives: ['Fastify', 'NestJS', 'Koa'],
    websiteUrl: 'https://expressjs.com',
    rules: {
      headers: { 'x-powered-by': /Express/i },
      cookies: [/connect\.sid/i],
    },
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'Backend Framework',
    icon: 'server',
    description: 'Progressive Node.js framework building efficient, scalable server-side applications.',
    roleInStack: 'Structured TypeScript microservices architecture with decorators and dependency injection.',
    alternatives: ['Spring Boot', 'Express', 'Fastify'],
    websiteUrl: 'https://nestjs.com',
    rules: {
      headers: { 'x-powered-by': /NestJS/i },
    },
  },
  {
    id: 'django',
    name: 'Django',
    category: 'Backend Framework',
    icon: 'server',
    description: 'High-level Python web framework encouraging rapid development and clean architecture.',
    roleInStack: 'Monolithic backend with built-in ORM, admin panel, and session authentication.',
    alternatives: ['FastAPI', 'Flask', 'Ruby on Rails'],
    websiteUrl: 'https://www.djangoproject.com',
    rules: {
      cookies: [/csrftoken/i, /sessionid/i],
      headers: { 'x-frame-options': /DENY/i },
    },
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'Backend Framework',
    icon: 'server',
    description: 'High-performance web framework for building APIs with Python 3.8+.',
    roleInStack: 'Asynchronous Python REST/OpenAPI microservice with automatic OpenAPI schema generation.',
    alternatives: ['Django REST Framework', 'Flask', 'Go (Fiber)'],
    websiteUrl: 'https://fastapi.tiangolo.com',
    rules: {
      html: [/Swagger UI/i, /docs\/oauth2-redirect\.html/i],
    },
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'API & Protocols',
    icon: 'code',
    description: 'Query language for APIs providing declarative data fetching.',
    roleInStack: 'API federation and data aggregation layer serving multiple client form factors.',
    alternatives: ['RESTful API', 'gRPC', 'tRPC'],
    websiteUrl: 'https://graphql.org',
    rules: {
      scripts: [/apollo-client/i, /graphql/i, /urql/i, /relay/i],
      html: [/graphql/i, /ApolloProvider/i],
    },
  },

  // --- DATABASES & CACHING ---
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database (Observed/Inferred)',
    icon: 'database',
    description: 'Advanced open-source relational database with robust ACID compliance.',
    roleInStack: 'Primary system of record storing transactional business data, JSONB documents, and relational entities.',
    alternatives: ['MySQL', 'CockroachDB', 'PlanetScale'],
    websiteUrl: 'https://postgresql.org',
    rules: {
      html: [/postgres/i, /supabase/i],
    },
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'Cache & In-Memory',
    icon: 'cpu',
    description: 'In-memory data structure store used for caching, rate limiting, and pub/sub.',
    roleInStack: 'Session storage, distributed rate limiting, API response caching, and pub/sub messaging.',
    alternatives: ['Memcached', 'Dragonfly', 'KeyDB', 'Valkey'],
    websiteUrl: 'https://redis.io',
    rules: {
      html: [/redis/i],
    },
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    category: 'Message Queue & Async',
    icon: 'cpu',
    description: 'AMQP message broker for reliable asynchronous job and event queuing.',
    roleInStack: 'Decoupled asynchronous worker queue for background processing and task pipelines.',
    alternatives: ['Apache Kafka', 'AWS SQS', 'BullMQ'],
    websiteUrl: 'https://www.rabbitmq.com',
    rules: {
      html: [/rabbitmq/i],
    },
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Cloud & Hosting',
    icon: 'database',
    description: 'Open source Firebase alternative providing PostgreSQL, Auth, and Realtime APIs.',
    roleInStack: 'BaaS platform providing PostgreSQL database, Row-Level Security auth, and vector storage.',
    alternatives: ['Firebase', 'Appwrite'],
    websiteUrl: 'https://supabase.com',
    rules: {
      scripts: [/@supabase\/supabase-js/i, /supabase\.co/i],
      html: [/supabase/i],
    },
  },

  // --- AUTHENTICATION & IDENTITY ---
  {
    id: 'auth0',
    name: 'Auth0 / Okta',
    category: 'Authentication & Identity',
    icon: 'lock',
    description: 'Enterprise identity management, SSO, and OAuth2/OIDC provider.',
    roleInStack: 'Centralized identity provider, social logins, MFA, and JWT token issuance.',
    alternatives: ['Clerk', 'Firebase Auth', 'Keycloak', 'WorkOS'],
    websiteUrl: 'https://auth0.com',
    rules: {
      scripts: [/auth0(\.min)?\.js/i, /cdn\.auth0\.com/i],
      cookies: [/auth0/i],
      dnsCname: [/auth0\.com/i],
    },
  },
  {
    id: 'clerk',
    name: 'Clerk',
    category: 'Authentication & Identity',
    icon: 'lock',
    description: 'Complete user management and authentication suite built for modern web applications.',
    roleInStack: 'Pre-built React/Next.js auth UI, session cookies, organization tenancy, and passkeys.',
    alternatives: ['Auth0', 'Supabase Auth', 'NextAuth.js'],
    websiteUrl: 'https://clerk.com',
    rules: {
      scripts: [/clerk\.[a-z0-9]+\.js/i, /clerk\.browser/i, /clerkcdn\.com/i],
      cookies: [/__clerk_db_jwt/i, /__session/i, /__client_uat/i],
    },
  },

  // --- ANALYTICS & OBSERVABILITY ---
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    category: 'Analytics & Observability',
    icon: 'globe',
    description: 'Web analytics service tracking user engagement, conversions, and traffic attribution.',
    roleInStack: 'User interaction telemetry, marketing attribution, and conversion funnel tracking.',
    alternatives: ['PostHog', 'Plausible', 'Mixpanel'],
    websiteUrl: 'https://analytics.google.com',
    rules: {
      scripts: [/googletagmanager\.com\/gtag\/js/i, /google-analytics\.com\/analytics\.js/i, /gtm\.js/i],
      cookies: [/_ga/i, /_gid/i, /_gat/i],
    },
  },
  {
    id: 'posthog',
    name: 'PostHog',
    category: 'Analytics & Observability',
    icon: 'globe',
    description: 'Product analytics, session replay, feature flags, and A/B testing platform.',
    roleInStack: 'Product event tracking, feature flag management, and user session replay recording.',
    alternatives: ['Mixpanel', 'Amplitude'],
    websiteUrl: 'https://posthog.com',
    rules: {
      scripts: [/posthog(\.min)?\.js/i, /app\.posthog\.com/i],
      cookies: [/ph_[a-z0-9]+_posthog/i],
    },
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'Analytics & Observability',
    icon: 'shield',
    description: 'Application monitoring and error tracking platform for diagnosing production bugs.',
    roleInStack: 'Real-time crash reporting, performance tracing, and source-mapped stack trace capture.',
    alternatives: ['Datadog', 'Bugsnag'],
    websiteUrl: 'https://sentry.io',
    rules: {
      scripts: [/browser\.sentry-cdn\.com/i, /@sentry\/browser/i, /sentry\.io/i],
    },
  },
  {
    id: 'datadog',
    name: 'Datadog RUM',
    category: 'Analytics & Observability',
    icon: 'shield',
    description: 'Real User Monitoring and APM platform for client-side vitals telemetry.',
    roleInStack: 'Browser vitals telemetry, synthetic checks, and distributed request tracing.',
    alternatives: ['New Relic', 'Dynatrace'],
    websiteUrl: 'https://datadoghq.com',
    rules: {
      scripts: [/datadog-rum/i, /browser-agent\.datadoghq-browser-agent\.com/i],
    },
  },

  // --- PAYMENTS & COMMERCE ---
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payment & E-Commerce',
    icon: 'lock',
    description: 'Financial infrastructure platform for internet commerce and subscription billing.',
    roleInStack: 'PCI-compliant card tokenization, webhook-driven subscription engine, and checkout UI.',
    alternatives: ['Paddle', 'Lemon Squeezy', 'PayPal', 'Adyen'],
    websiteUrl: 'https://stripe.com',
    rules: {
      scripts: [/js\.stripe\.com\/v3/i, /js\.stripe\.com\/v2/i],
      html: [/stripe-elements/i, /__privateStripeController/i],
    },
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'CMS & Static Site',
    icon: 'layers',
    description: 'Global commerce platform providing online storefronts and Storefront GraphQL API.',
    roleInStack: 'Hosted e-commerce platform with Liquid templating and Storefront GraphQL API.',
    alternatives: ['WooCommerce', 'Medusa.js'],
    websiteUrl: 'https://shopify.com',
    rules: {
      headers: { 'x-shopid': /.+/, 'x-shardid': /.+/ },
      scripts: [/cdn\.shopify\.com/i, /shopify-buy/i],
      html: [/Shopify\.theme/i, /cdn\.shopify\.com/i],
    },
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    category: 'CMS & Static Site',
    icon: 'layers',
    description: 'Open source content management system with extensive plugin architecture.',
    roleInStack: 'PHP + MySQL content management system with plugin ecosystem and REST API.',
    alternatives: ['Ghost', 'Strapi'],
    websiteUrl: 'https://wordpress.org',
    rules: {
      headers: { 'x-powered-by': /WordPress/i },
      meta: { generator: /WordPress/i },
      scripts: [/wp-content\/plugins/i, /wp-includes\/js/i],
      html: [/wp-content\//i, /wp-includes\//i, /class="[^"]*wp-block-[^"]*"/i],
    },
  },
  {
    id: 'cloudflare-turnstile',
    name: 'Cloudflare Turnstile',
    category: 'Security & WAF',
    icon: 'shield',
    description: 'Privacy-friendly bot detection and proof-of-humanity verification.',
    roleInStack: 'Frictionless bot defense for login, signup, and sensitive forms.',
    alternatives: ['reCAPTCHA', 'hCaptcha'],
    websiteUrl: 'https://www.cloudflare.com/products/turnstile/',
    rules: {
      scripts: [/challenges\.cloudflare\.com\/turnstile/i],
      html: [/cf-turnstile/i],
    },
  },
  {
    id: 'recaptcha',
    name: 'Google reCAPTCHA',
    category: 'Security & WAF',
    icon: 'shield',
    description: 'Risk analysis engine protecting websites from spam and automated credential abuse.',
    roleInStack: 'Automated threat scoring and bot challenge gate.',
    alternatives: ['Cloudflare Turnstile', 'hCaptcha'],
    websiteUrl: 'https://www.google.com/recaptcha/',
    rules: {
      scripts: [/google\.com\/recaptcha\/api\.js/i, /gstatic\.com\/recaptcha/i],
      html: [/g-recaptcha/i],
    },
  },
];

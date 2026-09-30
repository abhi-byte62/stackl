import { RawScanInput } from '../engines/analyzer';

export interface PresetSite {
  name: string;
  domain: string;
  url: string;
  category: string;
  description: string;
  badge: string;
  rawInput: RawScanInput;
}

export const PRESET_SITES: PresetSite[] = [
  {
    name: 'Stripe',
    domain: 'stripe.com',
    url: 'https://stripe.com',
    category: 'Fintech & Payments',
    description: 'Global financial infrastructure for internet commerce with custom React and Ruby microservices.',
    badge: 'Fintech Titan',
    rawInput: {
      url: 'https://stripe.com',
      headers: {
        server: 'cloudflare',
        'cf-ray': '89b88301ec-IAD',
        'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
        'content-security-policy': "default-src 'self' https://*.stripe.com; script-src 'self' https://js.stripe.com;",
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Stripe | Financial Infrastructure for the Internet</title>
            <meta name="generator" content="Next.js" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <div id="__next">
              <div class="flex flex-col min-h-screen bg-slate-950 text-white">
                <main class="stripe-elements">Interactive Payment Elements</main>
              </div>
            </div>
          </body>
        </html>
      `,
      scripts: [
        'https://js.stripe.com/v3/',
        'https://stripe.com/_next/static/chunks/main-app-398bc.js',
        'https://stripe.com/_next/static/chunks/webpack-482.js',
        'https://www.google-analytics.com/analytics.js',
        'https://browser.sentry-cdn.com/7.x/bundle.min.js',
      ],
      cookies: ['__stripe_mid=9938827', '_ga=GA1.2.9837482', 'cf_clearance=abc837492'],
      dns: {
        ipAddresses: ['104.18.2.19', '104.18.3.19'],
        nameservers: ['dns1.p01.nsone.net', 'dns2.p01.nsone.net'],
        hostingProvider: 'Cloudflare Inc. / AWS US-East',
        asn: 'AS13335 CLOUDFLARENET',
      },
    },
  },
  {
    name: 'Vercel',
    domain: 'vercel.com',
    url: 'https://vercel.com',
    category: 'Cloud & Developer Tools',
    description: 'Frontend cloud platform with Next.js edge runtime, Turbopack, and global edge network.',
    badge: 'Edge Cloud',
    rawInput: {
      url: 'https://vercel.com',
      headers: {
        server: 'Vercel',
        'x-vercel-id': 'iad1::iad1::kds82-172767',
        'x-vercel-cache': 'HIT',
        'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
        'content-security-policy': "default-src 'self' https://*.vercel.com;",
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Vercel: Build and deploy the best Web experiences</title>
            <meta name="generator" content="Next.js" />
          </head>
          <body>
            <div id="__next">
              <div class="bg-black text-white flex flex-col justify-between"></div>
            </div>
          </body>
        </html>
      `,
      scripts: [
        'https://vercel.com/_next/static/chunks/framework-883.js',
        'https://vercel.com/_next/static/chunks/main-992.js',
        'https://va.vercel-scripts.com/v1/script.debug.js',
        'https://challenges.cloudflare.com/turnstile/v0/api.js',
      ],
      cookies: ['_vercel_jwt=112938', '_ga=GA1.2.339281'],
      dns: {
        ipAddresses: ['76.76.21.21'],
        cname: 'cname.vercel-dns.com',
        nameservers: ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'],
        hostingProvider: 'Vercel Edge Network',
        asn: 'AS8987 VERCEL',
      },
    },
  },
  {
    name: 'Airbnb',
    domain: 'airbnb.com',
    url: 'https://airbnb.com',
    category: 'Travel & Marketplaces',
    description: 'Global vacation rental marketplace with React, GraphQL, Spring Boot Java services, and AWS.',
    badge: 'Marketplace',
    rawInput: {
      url: 'https://airbnb.com',
      headers: {
        server: 'nginx',
        'x-served-by': 'cache-iad-kiad-1',
        'x-amz-cf-id': '99ad88f-airbnb-cf',
        'strict-transport-security': 'max-age=10886400; includeSubDomains',
        'x-content-type-options': 'nosniff',
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Airbnb: Vacation Rentals, Cabins, Beach Houses</title>
            <meta name="viewport" content="width=device-width" />
          </head>
          <body>
            <div id="root" data-reactroot="">
              <div class="airbnb-app flex flex-col"></div>
            </div>
          </body>
        </html>
      `,
      scripts: [
        'https://a0.muscache.com/airbnb/static/packages/web/common-88a.js',
        'https://a0.muscache.com/airbnb/static/packages/web/react-dom.production.min.js',
        'https://a0.muscache.com/airbnb/static/packages/web/apollo-client.js',
        'https://cdn.optimizely.com/js/123.js',
        'https://browser-agent.datadoghq-browser-agent.com/datadog-rum.js',
      ],
      cookies: ['bev=1698273892_12', '_air_session=992837482', 'flags=1'],
      dns: {
        ipAddresses: ['64.233.160.1', '64.233.160.2'],
        nameservers: ['ns-123.awsdns-15.com', 'ns-456.awsdns-57.net'],
        hostingProvider: 'Amazon Web Services (AWS)',
        asn: 'AS16509 AMAZON-02',
      },
    },
  },
  {
    name: 'Shopify Store',
    domain: 'allbirds.com',
    url: 'https://www.allbirds.com',
    category: 'E-Commerce',
    description: 'High-volume direct-to-consumer brand powered by Shopify Plus, Fastly CDN, and GraphQL APIs.',
    badge: 'Commerce Plus',
    rawInput: {
      url: 'https://www.allbirds.com',
      headers: {
        server: 'cloudflare',
        'x-shopid': '1928374',
        'x-shardid': '14',
        'strict-transport-security': 'max-age=7889238',
        'content-security-policy': "default-src 'self' https://cdn.shopify.com;",
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Allbirds: Sustainable Wool Running Shoes</title>
            <script>window.Shopify = { theme: { name: "Production Allbirds 2026" } };</script>
          </head>
          <body>
            <div id="shopify-section-header" class="shopify-section"></div>
          </body>
        </html>
      `,
      scripts: [
        'https://cdn.shopify.com/s/files/1/0006/9059/7946/t/22/assets/shopify-buy.js',
        'https://js.stripe.com/v3/',
        'https://www.google-analytics.com/gtag/js',
        'https://cdn.attn.tv/allbirds/dtag.js',
      ],
      cookies: ['_shopify_s=9938827', '_shopify_y=1128374', 'cart_currency=USD'],
      dns: {
        ipAddresses: ['23.227.38.65'],
        cname: 'shops.myshopify.com',
        nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
        hostingProvider: 'Cloudflare / Shopify Edge',
        asn: 'AS13335 CLOUDFLARENET',
      },
    },
  },
];

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const articleDetailDuration = new Trend('article_detail_duration');
const productDetailDuration = new Trend('product_detail_duration');
const articleListDuration = new Trend('article_list_duration');
const productListDuration = new Trend('product_list_duration');

// Test profiles: set via CLI with `-e PROFILE=smoke` or `-e PROFILE=stress`
// Default is standard load test
const PROFILE = __ENV.PROFILE || 'load';

let scenarioConfig;
if (PROFILE === 'smoke') {
  scenarioConfig = {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
    },
  };
} else if (PROFILE === 'stress') {
  scenarioConfig = {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 0 },
      ],
    },
  };
} else {
  // Standard load test (target: p95 < 200ms under 20 concurrent VUs)
  scenarioConfig = {
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 20 },
        { duration: '30s', target: 0 },
      ],
    },
  };
}

export const options = {
  scenarios: scenarioConfig,
  thresholds: {
    // p95 < 200ms for all public read APIs
    'http_req_duration{endpoint:article_list}': ['p(95)<200'],
    'http_req_duration{endpoint:article_detail}': ['p(95)<200'],
    'http_req_duration{endpoint:product_list}': ['p(95)<200'],
    'http_req_duration{endpoint:product_detail}': ['p(95)<200'],
    'http_req_duration{endpoint:sitemap}': ['p(95)<500'],
    // Error rate must be under 1%
    errors: ['rate<0.01'],
    // Overall
    http_req_duration: ['p(95)<250'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

// Real test slugs matching actual seeded database records
const TEST_ARTICLE_SLUGS = [
  'huong-dan-cham-soc-da-buoi-sang',
  'cach-su-dung-serum-vitamin-c',
  'lam-sach-da-dung-cach',
];

const TEST_PRODUCT_SLUGS = [
  'sua-rua-mat-tra-xanh',
  'nuoc-tay-trang-ha',
  'serum-niacinamide-10',
  'tinh-chat-vit-c-15',
  'kem-duong-phuc-hoi-b5',
  'gel-duong-am-lo-hoi',
];

export default function () {
  // 1. Article list
  {
    const res = http.get(`${BASE_URL}/api/articles?page=0&size=10`, {
      tags: { endpoint: 'article_list' },
    });
    articleListDuration.add(res.timings.duration);
    const ok = check(res, {
      'article list status 200': (r) => r.status === 200,
      'article list has content': (r) => r.json('content') !== null,
      'article list p95 < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(!ok);
  }

  sleep(0.3);

  // 2. Article detail (STRICT: Must return HTTP 200, never count 404 as success)
  {
    const slug = TEST_ARTICLE_SLUGS[Math.floor(Math.random() * TEST_ARTICLE_SLUGS.length)];
    const res = http.get(`${BASE_URL}/api/articles/${slug}`, {
      tags: { endpoint: 'article_detail' },
    });
    articleDetailDuration.add(res.timings.duration);
    const ok = check(res, {
      'article detail status is 200': (r) => r.status === 200,
      'article detail has title': (r) => r.json('title') !== undefined,
      'article detail p95 < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(!ok);
  }

  sleep(0.3);

  // 3. Product list
  {
    const res = http.get(`${BASE_URL}/api/products?page=0&size=10`, {
      tags: { endpoint: 'product_list' },
    });
    productListDuration.add(res.timings.duration);
    const ok = check(res, {
      'product list status 200': (r) => r.status === 200,
      'product list has content': (r) => r.json('content') !== null,
      'product list p95 < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(!ok);
  }

  sleep(0.3);

  // 4. Product detail (STRICT: Must return HTTP 200, never count 404 as success)
  {
    const slug = TEST_PRODUCT_SLUGS[Math.floor(Math.random() * TEST_PRODUCT_SLUGS.length)];
    const res = http.get(`${BASE_URL}/api/products/${slug}`, {
      tags: { endpoint: 'product_detail' },
    });
    productDetailDuration.add(res.timings.duration);
    const ok = check(res, {
      'product detail status is 200': (r) => r.status === 200,
      'product detail has name': (r) => r.json('name') !== undefined,
      'product detail p95 < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(!ok);
  }

  sleep(0.3);

  // 5. Sitemap endpoint
  if (Math.random() < 0.1) {
    const res = http.get(`${BASE_URL}/api/sitemap/entries`, {
      tags: { endpoint: 'sitemap' },
    });
    check(res, {
      'sitemap status 200': (r) => r.status === 200,
      'sitemap p95 < 500ms': (r) => r.timings.duration < 500,
    });
  }

  sleep(0.5);
}

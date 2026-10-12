/**
 * End-to-End & Integration Test Suite for Marketing System
 * Tests: Backend APIs, Auth, RBAC, Cart/Orders, Revalidation, SSR & Sitemap
 */

const API_BASE = process.env.API_URL || 'http://localhost:8080';
const NEXTJS_BASE = process.env.NEXTJS_URL || 'http://localhost:3000';
const REVALIDATE_SECRET = process.env.NEXTJS_REVALIDATE_SECRET || 'c2VjdXJlX3JldmFsaWRhdGVfc2VjcmV0XzIwMjQ=';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function logTest(name, passed, detail = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  ✓ PASS: ${name}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${name} ${detail ? '(' + detail + ')' : ''}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('MARKETING E2E & INTEGRATION TEST SUITE');
  console.log(`Target Backend: ${API_BASE}`);
  console.log(`Target Next.js: ${NEXTJS_BASE}`);
  console.log('====================================================\n');

  // --- 1. HEALTH & READINESS ---
  console.log('[1] Checking System Health & Actuator...');
  try {
    const res = await fetch(`${API_BASE}/actuator/health`);
    const data = await res.json().catch(() => ({}));
    logTest('Actuator Health Endpoint returns HTTP 200 and status UP', res.status === 200 && data.status === 'UP');
  } catch (e) {
    logTest('Actuator Health Endpoint reachable', false, e.message);
  }

  // --- 2. PUBLIC READ APIS ---
  console.log('\n[2] Checking Public Read APIs...');
  let sampleProductSlug = null;
  try {
    const res = await fetch(`${API_BASE}/api/products?size=5`);
    const data = await res.json();
    const hasProducts = res.status === 200 && Array.isArray(data.content);
    logTest('GET /api/products returns paginated products', hasProducts);
    if (hasProducts && data.content.length > 0) {
      sampleProductSlug = data.content[0].slug;
    }
  } catch (e) {
    logTest('GET /api/products reachable', false, e.message);
  }

  if (sampleProductSlug) {
    try {
      const res = await fetch(`${API_BASE}/api/products/slug/${sampleProductSlug}`);
      const data = await res.json();
      logTest(`GET /api/products/slug/${sampleProductSlug} returns valid product detail`, 
        res.status === 200 && data.slug === sampleProductSlug && data.price > 0);
    } catch (e) {
      logTest(`GET /api/products/slug/${sampleProductSlug}`, false, e.message);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/api/products/slug/non-existent-product-slug-xyz-999`);
    logTest('GET /api/products/slug with invalid slug returns HTTP 404', res.status === 404);
  } catch (e) {
    logTest('Invalid product slug returns 404', false, e.message);
  }

  // --- 3. SITEMAP ENTRIES API ---
  console.log('\n[3] Checking Sitemap Entries API...');
  try {
    const res = await fetch(`${API_BASE}/api/sitemap/entries`);
    const entries = await res.json();
    logTest('GET /api/sitemap/entries returns list of sitemap items', 
      res.status === 200 && Array.isArray(entries));
  } catch (e) {
    logTest('GET /api/sitemap/entries', false, e.message);
  }

  // --- 4. AUTHENTICATION & RBAC ---
  console.log('\n[4] Checking Authentication & RBAC Security...');
  const testEmail = `test_user_${Date.now()}@example.com`;
  const testPassword = 'Password123!@#';
  let userToken = null;

  try {
    const regRes = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: 'Test Automation User',
        phone: '0901234567'
      })
    });
    logTest('POST /api/auth/register registers a new customer', regRes.status === 200 || regRes.status === 201);
  } catch (e) {
    logTest('POST /api/auth/register', false, e.message);
  }

  try {
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json().catch(() => ({}));
    if (loginRes.status === 200 && loginData.accessToken) {
      userToken = loginData.accessToken;
      logTest('POST /api/auth/login succeeds and returns JWT accessToken', true);
    } else {
      logTest('POST /api/auth/login succeeds', false, `Status ${loginRes.status}`);
    }
  } catch (e) {
    logTest('POST /api/auth/login', false, e.message);
  }

  // RBAC: User accessing admin API should be 403 Forbidden
  if (userToken) {
    try {
      const adminRes = await fetch(`${API_BASE}/api/admin/products`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      logTest('Normal user cannot access /api/admin/* (returns HTTP 403 Forbidden)', adminRes.status === 403);
    } catch (e) {
      logTest('Admin RBAC check', false, e.message);
    }
  }

  // Unauthenticated access to protected orders
  try {
    const unauthRes = await fetch(`${API_BASE}/api/orders`);
    logTest('Unauthenticated access to /api/orders returns HTTP 401', unauthRes.status === 401);
  } catch (e) {
    logTest('Unauthenticated order check', false, e.message);
  }

  // --- 5. NEXT.JS ISR REVALIDATION WEBHOOK ---
  console.log('\n[5] Checking Next.js Revalidation Webhook Security...');
  try {
    const invalidSecretRes = await fetch(`${NEXTJS_BASE}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': 'wrong-secret'
      },
      body: JSON.stringify({ type: 'product', slug: 'test' })
    });
    logTest('POST /api/revalidate with invalid secret returns HTTP 401 Unauthorized', invalidSecretRes.status === 401);
  } catch (e) {
    logTest('Revalidate security check reachable', false, e.message);
  }

  try {
    const validSecretRes = await fetch(`${NEXTJS_BASE}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': REVALIDATE_SECRET
      },
      body: JSON.stringify({ type: 'product', slug: 'sample-product' })
    });
    const revalData = await validSecretRes.json().catch(() => ({}));
    logTest('POST /api/revalidate with valid secret triggers revalidation', 
      validSecretRes.status === 200 && revalData.revalidated === true);
  } catch (e) {
    logTest('Revalidate with valid secret', false, e.message);
  }

  // --- 6. NEXT.JS SSR & TECHNICAL SEO ---
  console.log('\n[6] Checking Next.js SSR, Robots & Sitemap...');
  try {
    const robotsRes = await fetch(`${NEXTJS_BASE}/robots.txt`);
    const robotsText = await robotsRes.text();
    const hasSitemap = robotsText.includes('sitemap.xml');
    const doesNotBlockNext = !robotsText.includes('Disallow: /_next/');
    logTest('robots.txt exposes sitemap and does NOT block Googlebot /_next/ assets', 
      robotsRes.status === 200 && hasSitemap && doesNotBlockNext);
  } catch (e) {
    logTest('robots.txt reachable', false, e.message);
  }

  try {
    const sitemapRes = await fetch(`${NEXTJS_BASE}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    const hasXml = sitemapText.includes('<urlset') || sitemapText.includes('<url>');
    logTest('sitemap.xml returns valid XML sitemap schema', sitemapRes.status === 200 && hasXml);
  } catch (e) {
    logTest('sitemap.xml reachable', false, e.message);
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log('====================================================');
  
  if (failedTests > 0) {
    console.log('Note: Some tests may fail if services are currently offline or in sandbox mode.');
  }
}

runTests().catch(console.error);

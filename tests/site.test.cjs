const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const API = 'https://api.github.com/repos/a1175815821/MegaDownloader-Revival';
const CACHE = 'mdr2-cache-v2';
const DOWNLOAD = 'https://github.com/a1175815821/MegaDownloader-Revival/releases/download/v3.0.0/';
const release = {
  tag_name: 'v3.0.0', published_at: '2026-10-27T18:00:00Z', draft: false, prerelease: false,
  assets: [
    { name: 'portable.zip', size: 12345678, browser_download_url: DOWNLOAD + 'portable.zip', download_count: 2000 },
    { name: 'MegaDownloader.exe', size: 23456789, browser_download_url: DOWNLOAD + 'MegaDownloader.exe', download_count: 345 }
  ]
};
let server, browser, origin;
const failures = [];

before(async () => {
  const headersFile = await fs.readFile(path.join(ROOT, '_headers'), 'utf8');
  const csp = headersFile.match(/Content-Security-Policy: (.+)/)[1].trim();
  server = http.createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const filename = path.join(ROOT, pathname === '/' ? 'index.html' : pathname.slice(1));
      if (!filename.startsWith(ROOT + path.sep)) throw new Error('Outside root');
      const body = await fs.readFile(filename);
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' }[path.extname(filename)] || 'text/plain';
      res.writeHead(200, { 'Content-Type': type + '; charset=utf-8', 'Content-Security-Policy': csp });
      res.end(body);
    } catch {
      res.writeHead(404); res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  assert.deepEqual(failures, [], 'Uncaught page errors');
});

function saved({ stars = 11, dls = 100, age = 0, releaseAge = age } = {}) {
  return {
    version: 2,
    data: { stars, dls, release: {
      tag: release.tag_name, publishedAt: release.published_at,
      assets: release.assets.map(a => ({ name: a.name, size: a.size, url: a.browser_download_url }))
    } },
    updated: { stars: Date.now() - age, dls: Date.now() - age, release: Date.now() - releaseAge }
  };
}

async function setup(options = {}) {
  const context = await browser.newContext({
    locale: 'zh-CN', timezoneId: 'Asia/Shanghai', reducedMotion: options.motion ? 'no-preference' : 'reduce',
    viewport: options.mobile ? { width: 390, height: 844 } : { width: 1440, height: 1100 },
    colorScheme: 'dark'
  });
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  await context.route('https://fonts.gstatic.com/**', route => route.abort());
  const calls = [];
  await context.route(API + '**', async route => {
    const url = new URL(route.request().url());
    calls.push(url.pathname + url.search);
    if (options.live) return route.continue();
    if (options.respond) return options.respond(route, url);
    if (options.delay) await new Promise(resolve => setTimeout(resolve, options.delay));
    const body = url.pathname.endsWith('/latest') ? release : url.pathname.endsWith('/releases') ? [release] : { stargazers_count: 77 };
    await route.fulfill({ json: body });
  });
  await context.addInitScript(({ cache, oldCache, noStorage, noObserver, noCanvas, theme }) => {
    if (cache !== undefined && !localStorage.getItem('test-seeded')) {
      localStorage.setItem('mdr2-cache-v2', typeof cache === 'string' ? cache : JSON.stringify(cache));
      localStorage.setItem('test-seeded', '1');
    }
    if (oldCache) localStorage.setItem('mdr2-cache-v1', JSON.stringify(oldCache));
    if (theme) localStorage.setItem('mdr-theme', theme);
    if (noStorage) {
      Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error('Storage disabled'); };
    }
    if (noObserver) window.IntersectionObserver = undefined;
    if (noCanvas) HTMLCanvasElement.prototype.getContext = () => null;
  }, options);
  const page = await context.newPage();
  page.on('pageerror', error => failures.push(error.message));
  if (options.clock) await page.clock.install();
  await page.goto(origin);
  await page.locator('.stats').scrollIntoViewIfNeeded();
  return { context, page, calls };
}

async function synced(page) {
  await page.waitForFunction(() => document.querySelector('#syncStatus').getAttribute('aria-busy') === 'false' &&
    !document.querySelector('#syncStatus').textContent.includes('正在获取'));
}

async function counts(page) {
  return page.locator('[data-count="stars"], [data-count="dls"]').allTextContents();
}

test('fresh GitHub data, cache reload, language switches, download links and mobile labels', async () => {
  const { context, page, calls } = await setup({ mobile: true });
  try {
    await synced(page);
    assert.deepEqual(await counts(page), ['77', '2,345']);
    assert.equal(await page.locator('[data-download="zip"]').getAttribute('href'), DOWNLOAD + 'portable.zip');
    assert.equal(await page.locator('[data-download="exe"]').getAttribute('href'), DOWNLOAD + 'MegaDownloader.exe');
    assert.match(await page.locator('[data-i18n="hero.badge"]').textContent(), /v3\.0\.0.*2026-10-28/);
    assert.equal(await page.locator('[data-asset-size="zip"]').textContent(), '.ZIP · ≈ 12.3 MB');
    assert.equal(await page.locator('.m-bar [data-ver]').isVisible(), true);
    assert.equal(await page.locator('.m-bar [data-ver]').textContent(), 'v3.0.0');
    await page.locator('#langBtn').click();
    assert.equal(await page.locator('h3[data-i18n-html="dl.a1"] small').count(), 1);
    assert.match(await page.locator('[data-i18n-html="dl.desc"]').textContent(), /v3\.0\.0/);
    await page.locator('#langBtn').click();
    assert.equal(await page.locator('[data-asset-size="exe"]').textContent(), '.EXE · ≈ 23.5 MB');
    assert.match(await page.locator('.vs-table td:nth-child(3)').first().evaluate(el => getComputedStyle(el, '::before').content), /v3\.0\.0/);
    assert.equal(await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent).softwareVersion), '3.0.0');
    const requestCount = calls.length;
    await page.reload(); await synced(page);
    assert.equal(calls.length, requestCount, 'Fresh cache avoids new requests');
    assert.deepEqual(await counts(page), ['77', '2,345']);
    await page.locator('.faq-q').first().click();
    assert.equal(await page.locator('.faq-q').first().getAttribute('aria-expanded'), 'true');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true,
      JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
        const r = el.getBoundingClientRect(); return r.right > innerWidth && getComputedStyle(el).position !== 'fixed';
      }).slice(0, 15).map(el => ({ tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right })))));
  } finally { await context.close(); }
});

test('new counts win over an in-progress animation of expired cached values', async () => {
  const { context, page } = await setup({ motion: true, delay: 250, cache: saved({ age: 7 * 3600000 }) });
  try {
    await synced(page);
    await page.waitForTimeout(1600);
    assert.deepEqual(await counts(page), ['77', '2,345']);
    assert.equal(await page.locator('#ghStars').textContent(), '★ 77');
  } finally { await context.close(); }
});

test('zero counts are valid data', async () => {
  const { context, page } = await setup({ respond: (route, url) => route.fulfill({
    json: url.pathname.endsWith('/latest') ? release : url.pathname.endsWith('/releases') ? [] : { stargazers_count: 0 }
  }) });
  try { await synced(page); assert.deepEqual(await counts(page), ['0', '0']); }
  finally { await context.close(); }
});

test('GitHub rate limiting preserves expired successful data and keeps the page interactive', async () => {
  const cache = saved({ age: 7 * 3600000 });
  const { context, page } = await setup({ cache, respond: route => route.fulfill({ status: 403, json: { message: 'API rate limit exceeded' } }) });
  try {
    await synced(page);
    assert.deepEqual(await counts(page), ['11', '100']);
    assert.match(await page.locator('#syncStatus').textContent(), /上次成功/);
    assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), CACHE), cache, 'Failures do not refresh cache timestamps');
    await page.locator('#langBtn').click();
    assert.match(await page.locator('#syncStatus').textContent(), /unavailable/);
    await page.locator('.faq-q').first().click();
    assert.equal(await page.locator('.faq-q').first().getAttribute('aria-expanded'), 'true');
  } finally { await context.close(); }
});

test('no cache and all requests failing never invent counts or a release version', async () => {
  const { context, page } = await setup({ respond: route => route.abort() });
  try {
    await synced(page);
    assert.deepEqual(await counts(page), ['--', '--']);
    assert.match(await page.locator('#syncStatus').textContent(), /暂无法获取/);
    assert.equal(await page.locator('[data-ver]').first().textContent(), '');
  } finally { await context.close(); }
});

test('download totals include all release pages and stable version comes from /latest', async () => {
  const { context, page, calls } = await setup({ respond: (route, url) => {
    if (url.pathname.endsWith('/latest')) return route.fulfill({ json: release });
    if (!url.pathname.endsWith('/releases')) return route.fulfill({ json: { stargazers_count: 77 } });
    if (url.searchParams.get('page') === '2') return route.fulfill({ json: [{ assets: [{ download_count: 9 }] }] });
    return route.fulfill({
      headers: { Link: `<${API}/releases?per_page=100&page=2>; rel="next"`, 'Access-Control-Expose-Headers': 'Link' },
      json: [{ tag_name: 'v4-beta', prerelease: true, assets: [{ download_count: 100 }] }, release]
    });
  } });
  try {
    await synced(page);
    assert.deepEqual(await counts(page), ['77', '2,454']);
    assert.ok(calls.some(url => url.includes('page=2')));
    assert.equal(await page.locator('[data-ver]').first().textContent(), 'v3.0.0');
  } finally { await context.close(); }
});

test('a failed later page does not publish a partial total; independent star refresh succeeds', async () => {
  const { context, page } = await setup({ cache: saved({ age: 7 * 3600000 }), respond: (route, url) => {
    if (url.pathname.endsWith('/latest')) return route.fulfill({ json: release });
    if (!url.pathname.endsWith('/releases')) return route.fulfill({ json: { stargazers_count: 88 } });
    if (url.searchParams.get('page') === '2') return route.fulfill({ status: 500, body: '' });
    return route.fulfill({ headers: { Link: `<${API}/releases?page=2>; rel="next"`, 'Access-Control-Expose-Headers': 'Link' }, json: [release] });
  } });
  try {
    await synced(page);
    assert.deepEqual(await counts(page), ['88', '100']);
    assert.match(await page.locator('#syncStatus').textContent(), /更新暂不可用/);
  } finally { await context.close(); }
});

test('an open tab refreshes counts after five minutes without re-fetching fresh release metadata', async () => {
  const { context, page, calls } = await setup({ cache: saved(), clock: true });
  try {
    await synced(page);
    assert.equal(calls.length, 0);
    await page.clock.fastForward(5 * 60000 + 1000);
    await page.waitForFunction(() => document.querySelector('[data-count="dls"]').textContent === '2,345');
    assert.equal(calls.length, 2);
    assert.equal(calls.some(url => url.endsWith('/latest')), false);
  } finally { await context.close(); }
});

test('automatic system theme survives reload; a manual selection overrides later system changes', async () => {
  const { context, page } = await setup();
  try {
    await synced(page);
    assert.equal(await page.evaluate(() => localStorage.getItem('mdr-theme')), null);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
    await page.reload(); await synced(page);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.locator('#themeBtn').click();
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.reload(); await synced(page);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  } finally { await context.close(); }
});

test('navigation controls and content fit narrow and wide screens in both languages', async () => {
  const { context, page } = await setup();
  try {
    await synced(page);
    for (const lang of ['zh-CN', 'en']) {
      if (lang === 'en') await page.locator('#langBtn').click();
      for (const width of [320, 390, 540, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        // Force a rendered frame after viewport emulation and retain images for visual QA.
        await fs.mkdir(path.join(ROOT, 'test-results'), { recursive: true });
        await page.screenshot({ path: path.join(ROOT, 'test-results', `layout-${lang}-${width}.png`), animations: 'disabled' });
        const layout = await page.evaluate(() => ({
          viewport: innerWidth, document: document.documentElement.scrollWidth,
          overflow: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth &&
            !el.closest('.bg-fx,#glow,.hero-stage,.ticker,.megaband,.cta')).slice(0, 15).map(el => ({
            tag: el.tagName, class: el.className, text: el.textContent.slice(0, 70), right: el.getBoundingClientRect().right
          })),
          controls: [...document.querySelectorAll('.nav-cta button, .nav-cta a')].map(el => ({
            id: el.id || el.className, left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right
          }))
        }));
        assert.ok(layout.document <= width, `${lang} ${width}px document: ${JSON.stringify(layout)}`);
        assert.ok(layout.controls.every(el => el.left >= 0 && el.right <= width), `${lang} ${width}px controls: ${JSON.stringify(layout)}`);
      }
    }
  } finally { await context.close(); }
});

test('live GitHub smoke check', { skip: !process.env.LIVE_GITHUB }, async () => {
  const { context, page } = await setup({ live: true });
  try {
    await synced(page);
    const data = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), CACHE);
    assert.ok(data && Number.isSafeInteger(data.data.stars) && Number.isSafeInteger(data.data.dls));
    assert.ok(data.data.release.tag);
    assert.equal(await page.locator('#syncStatus').textContent().then(text => text.includes('暂不可用')), false);
    console.log('Live GitHub:', JSON.stringify(data.data));
    await fs.mkdir(path.join(ROOT, 'test-results'), { recursive: true });
    await page.screenshot({ path: path.join(ROOT, 'test-results', 'live-desktop.png'), animations: 'disabled' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(ROOT, 'test-results', 'live-mobile.png'), animations: 'disabled' });
  } finally { await context.close(); }
});

test('the demo countdown advances in seconds', async () => {
  const { context, page } = await setup({ motion: true, clock: true });
  try {
    await synced(page);
    const seconds = value => value.split(':').reduce((minutes, second) => minutes * 60 + Number(second), 0);
    const start = seconds(await page.locator('#quotaTime').textContent());
    await page.clock.runFor(2100);
    const elapsed = start - seconds(await page.locator('#quotaTime').textContent());
    assert.ok(elapsed >= 1 && elapsed <= 3, `elapsed ${elapsed} seconds`);
  } finally { await context.close(); }
});

test('internal anchors, IDs and translated markup stay valid', async () => {
  const { context, page } = await setup();
  try {
    await synced(page);
    const issues = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      return {
        duplicateIDs: ids.filter((id, index) => ids.indexOf(id) !== index),
        missingAnchors: [...document.querySelectorAll('a[href^="#"]')].map(el => el.getAttribute('href').slice(1)).filter(id => !document.getElementById(id))
      };
    });
    assert.deepEqual(issues, { duplicateIDs: [], missingAnchors: [] });
    await page.locator('#langBtn').click();
    assert.equal(await page.locator('[data-i18n]').evaluateAll(elements => elements.some(el => /<\/?(?:b|small|em|span|br)[\s>]/.test(el.textContent))), false);
  } finally { await context.close(); }
});

for (const [name, options] of [
  ['the old broken cache format', { oldCache: { ts: Date.now(), stars: 53, dls: 2172, tag: 'v2.5.8' } }],
  ['malformed JSON cache', { cache: '{broken' }],
  ['structurally invalid cache', { cache: { version: 2, data: { stars: -10, dls: '100' }, updated: { stars: Date.now(), dls: Date.now() } } }],
  ['blocked storage', { noStorage: true }],
  ['unavailable canvas and IntersectionObserver', { noCanvas: true, noObserver: true, motion: true }]
]) {
  test(`recovers from ${name}`, async () => {
    const { context, page } = await setup(options);
    try {
      await synced(page);
      assert.deepEqual(await counts(page), ['77', '2,345']);
      await page.locator('.faq-q').first().click();
      assert.equal(await page.locator('.faq-q').first().getAttribute('aria-expanded'), 'true');
    } finally { await context.close(); }
  });
}

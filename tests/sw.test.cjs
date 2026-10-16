const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup({ cached = null } = {}) {
  const handlers = {};
  const deleted = [];
  const called = [];
  const cache = {
    open: async () => ({ addAll: async urls => called.push(['precache', urls]) }),
    keys: async () => ['lanu-v1', 'lanu-v2', 'another-app-v1'],
    delete: async key => { deleted.push(key); return true; },
    match: async () => cached
  };
  const ctx = {
    self: {
      location: { origin: 'https://example.com' },
      addEventListener: (name, handler) => { handlers[name] = handler; },
      skipWaiting: () => called.push(['skipWaiting']),
      clients: { claim: async () => called.push(['claim']) }
    },
    caches: cache,
    URL,
    fetch: async req => { called.push(['network', req.url]); return { ok: true }; }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8'), ctx);
  return { handlers, deleted, called };
}

test('install precaches app shell', async () => {
  const { handlers, called } = setup();
  let pending;
  handlers.install({ waitUntil(p) { pending = p; } });
  await pending;
  assert.deepEqual(called[0], ['skipWaiting']);
  assert.deepEqual(Array.from(called[1][1]), ['./index.html', './manifest.json']);
});

test('activate deletes only older LANU caches before claiming clients', async () => {
  const { handlers, deleted, called } = setup();
  let pending;
  handlers.activate({ waitUntil(p) { pending = p; } });
  await pending;
  assert.deepEqual(deleted, ['lanu-v1']);
  assert.deepEqual(called, [['claim']]);
});

test('POST and cross-origin requests are untouched', () => {
  const { handlers } = setup();
  for (const req of [
    { method: 'POST', url: 'https://example.com/api' },
    { method: 'GET', url: 'https://another.example/path' }
  ]) {
    let responded = false;
    handlers.fetch({ request: req, respondWith() { responded = true; } });
    assert.equal(responded, false);
  }
});

test('same-origin GET uses cache then network fallback', async () => {
  for (const cached of [{ cached: true }, null]) {
    const { handlers, called } = setup({ cached });
    let response;
    handlers.fetch({
      request: { method: 'GET', url: 'https://example.com/index.html' },
      respondWith(p) { response = p; }
    });
    assert.deepEqual(await response, cached || { ok: true });
    assert.equal(called.some(c => c[0] === 'network'), cached === null);
  }
});

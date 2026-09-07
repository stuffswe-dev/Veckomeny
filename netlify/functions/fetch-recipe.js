// Hämtar en receptsidas strukturerade data (schema.org "Recipe") server-side,
// så webbläsaren slipper CORS-problemet med att läsa en annan sajt direkt.
// Använder Node:s inbyggda https-modul istället för fetch(), som inte kan
// garanteras finnas globalt i alla Netlify Functions-körmiljöer.
const https = require('https');
const http = require('http');

exports.handler = async (event) => {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) return respond(400, { error: 'Ingen länk angavs.' });

  let target;
  try {
    target = new URL(url);
    if (!/^https?:$/.test(target.protocol)) throw new Error('bad protocol');
  } catch (e) {
    return respond(400, { error: 'Ogiltig länk.' });
  }

  try {
    const html = await fetchHtml(target.toString(), 5);
    const recipe = extractRecipe(html);
    if (!recipe) return respond(404, { error: 'Hittade ingen strukturerad receptdata på den sidan.' });
    return respond(200, recipe);
  } catch (e) {
    return respond(502, { error: 'Kunde inte hämta sidan: ' + (e && e.message ? e.message : String(e)) });
  }
};

function fetchHtml(urlStr, redirectsLeft) {
  return new Promise((resolve, reject) => {
    let u;
    try {
      u = new URL(urlStr);
    } catch (e) {
      reject(new Error('Ogiltig länk'));
      return;
    }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.get(
      u,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
        timeout: 8000,
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
          res.resume();
          const nextUrl = new URL(res.headers.location, u).toString();
          resolve(fetchHtml(nextUrl, redirectsLeft - 1));
          return;
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          res.resume();
          reject(new Error(`Sidan svarade med status ${res.statusCode}`));
          return;
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve(data));
      }
    );
    req.on('timeout', () => { req.destroy(new Error('Tog för lång tid (timeout)')); });
    req.on('error', (err) => reject(err));
  });
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body),
  };
}

function extractRecipe(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b[1]); } catch (e) { continue; }
    const found = findRecipe(data);
    if (found) return normalizeRecipe(found);
  }
  return null;
}

function findRecipe(node) {
  if (!node) return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const r = findRecipe(n);
      if (r) return r;
    }
    return null;
  }
  if (typeof node !== 'object') return null;
  const type = node['@type'];
  const isRecipe = type === 'Recipe' || (Array.isArray(type) && type.indexOf('Recipe') !== -1);
  if (isRecipe) return node;
  if (node['@graph']) return findRecipe(node['@graph']);
  return null;
}

function normalizeRecipe(r) {
  let image = r.image;
  if (Array.isArray(image)) image = image[0];
  if (image && typeof image === 'object') image = image.url || null;
  const rawIngredients = Array.isArray(r.recipeIngredient) ? r.recipeIngredient : [];
  return {
    name: r.name || '',
    image: image || null,
    ingredients: rawIngredients.map(splitIngredientLine),
  };
}

function splitIngredientLine(line) {
  const text = String(line).trim();
  const m = text.match(/^([\d.,/½¼¾\s]*\s*(?:dl|l|msk|tsk|g|kg|st|krm|paket|burk|förp|skivor?|klyftor?)?)\s*(.*)$/i);
  if (m && m[2] && m[1].trim()) return { item: m[2].trim(), amount: m[1].trim() };
  return { item: text, amount: '' };
}


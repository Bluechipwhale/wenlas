// Import the public Wenlas seller catalogue. No account or database credentials are used.
const fs = require('node:fs');
const SOURCE = 'https://jiji.ng/sellerpage-Cya3vFFCDoDTmxwjjm6P39IL';
const CACHE = '.data/wenlas-import';

function decodeNuxt(html) {
  const match = html.match(/id="__NUXT_DATA__">([\s\S]*?)<\/script>/);
  if (!match) throw Error('Source page has no catalogue data');
  const values = JSON.parse(match[1]), cache = new Map();
  function read(index) {
    if (index < 0) return undefined;
    if (cache.has(index)) return cache.get(index);
    const value = values[index];
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) {
      if (['ShallowReactive', 'Reactive', 'Ref', 'ShallowRef'].includes(value[0])) return read(value[1]);
      const result = []; cache.set(index, result);
      value.forEach(item => result.push(read(item))); return result;
    }
    const result = {}; cache.set(index, result);
    for (const [key, item] of Object.entries(value)) result[key] = read(item);
    return result;
  }
  return read(0);
}

async function request(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || !['jiji.ng', 'pictures-nigeria.jijistatic.net'].includes(parsed.hostname)) throw Error('Unexpected source host');
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.ok) return response;
    if (attempt === 4) throw Error(`Source request failed: ${response.status} ${parsed.pathname}`);
    await new Promise(resolve => setTimeout(resolve, response.status === 429 ? 15000 * (attempt + 1) : 2000));
  }
}

async function pool(rows, task, concurrency = 4) {
  let index = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (index < rows.length) { const row = rows[index++]; await task(row); }
  }));
}

async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  let listing = decodeNuxt(await (await request(SOURCE)).text()).data[new URL(SOURCE).pathname].listing;
  const expected = listing.adverts_list.count, rows = [];
  for (let page = 1; ; page++) {
    fs.writeFileSync(`${CACHE}/listing-${page}.json`, JSON.stringify(listing));
    rows.push(...listing.adverts_list.adverts);
    if (!listing.next_url) break;
    if (page >= 20) throw Error('Unexpected pagination loop');
    listing = await (await request(listing.next_url)).json();
  }
  const unique = [...new Map(rows.map(row => [row.id, row])).values()];
  if (unique.length !== expected) throw Error(`Incomplete catalogue: ${unique.length}/${expected}`);
  if (unique.some(row => row.user_id !== 14180778 || row.seller.user_name !== 'WENLAS RESOURCES LTD')) throw Error('Unexpected seller');
  console.log(`Verified ${unique.length} unique listings; collecting full descriptions and photos.`);
  let completed = 0;
  const details = new Map();
  await pool(unique, async row => {
    const file = `${CACHE}/product-${row.id}.json`;
    let detail;
    if (fs.existsSync(file) && !process.argv.includes('--refresh')) detail = JSON.parse(fs.readFileSync(file, 'utf8'));
    else {
      const data = decodeNuxt(await (await request('https://jiji.ng' + row.url.split('?')[0])).text()).data;
      detail = data['advert-item-' + row.guid]?.advert?.advert;
      if (!detail || detail.id !== row.id) throw Error('Source product mismatch');
      fs.writeFileSync(file, JSON.stringify(detail));
      await new Promise(resolve => setTimeout(resolve, 1400));
    }
    if (!detail.is_active || detail.is_closed || !detail.images?.length) throw Error(`Review unavailable listing ${row.id}`);
    details.set(row.id, detail);
    if (++completed % 20 === 0) console.log(`Read ${completed}/${expected} products`);
  }, 1);
  const imageMap = new Map();
  unique.forEach(row => details.get(row.id).images.forEach(image => imageMap.set(image.url, `/images/wenlas/${image.id}${new URL(image.url).pathname.endsWith('.webp') ? '.webp' : '.jpg'}`)));
  fs.mkdirSync('public/images/wenlas', { recursive: true });
  await pool([...imageMap], async ([url, local]) => {
    const file = 'public' + local;
    if (fs.existsSync(file) && fs.statSync(file).size > 0) return;
    const response = await request(url);
    if (!response.headers.get('content-type')?.startsWith('image/')) throw Error('Invalid source photo');
    fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  }, 6);
  const now = new Date().toISOString();
  const products = unique.map((row, index) => {
    const detail = details.get(row.id);
    const price = detail.price?.value ?? detail.price_obj?.value ?? row.price_obj.value;
    const priceKobo = Math.round(Number(price) * 100);
    if (!Number.isSafeInteger(priceKobo) || priceKobo <= 0) throw Error('Unverified price');
    const images = detail.images.map(image => imageMap.get(image.url));
    const attributes = detail.attrs.map(attr => ({ name: attr.name, value: Array.isArray(attr.value) ? attr.value.join(', ') : String(attr.value), ...(attr.unit ? { unit: attr.unit } : {}) }));
    return {
      id: `wenlas-${row.id}`, slug: `${row.slug}-${row.id}`, name: detail.title,
      category_id: row.category_slug, brand: attributes.find(attr => attr.name === 'Brand')?.value || 'Wenlas',
      merchant_id: 'wenlas', merchant_name: 'Wenlas Resources Ltd.', price_kobo: priceKobo,
      stock: 0, reserved: 0, inventory_status: 'unconfirmed', image: images[0], images,
      description: detail.description, attributes, options: {}, featured: index < 8, active: true,
      created_at: new Date(detail.date_created).toISOString(), source_url: 'https://jiji.ng' + row.url.split('?')[0],
      source_id: String(row.id), imported_at: now,
    };
  });
  const categories = [...new Map(unique.map(row => [row.category_slug, {
    id: row.category_slug, name: row.category_name, image: products.find(product => product.category_id === row.category_slug).image,
  }])).values()].sort((a, b) => products.filter(p => p.category_id === b.id).length - products.filter(p => p.category_id === a.id).length);
  const manifest = { source: SOURCE, seller: 'Wenlas Resources Ltd.', imported_at: now, source_listing_count: expected, product_count: products.length, image_count: imageMap.size, categories, products };
  fs.writeFileSync('data/wenlas-products.json', JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ products: products.length, categories: categories.length, photos: imageMap.size, inventory: 'unconfirmed' }));
}

module.exports = { decodeNuxt, main };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });

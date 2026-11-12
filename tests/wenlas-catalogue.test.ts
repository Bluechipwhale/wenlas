import {afterEach,expect,it,vi} from 'vitest';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import snapshot from '../data/wenlas-products.json';
import {wenlasCatalogue,wenlasProducts,wenlasCategories} from '../src/lib/wenlas-catalogue';
import {LocalStore} from '../src/lib/local-store';
import {configured} from '../src/lib/server';
import {productSchema} from '../src/lib/resources';
import {defaultTheme,assertPublishable} from '../src/lib/theme';

afterEach(()=>vi.unstubAllEnvs());

it('imports the complete seller catalogue with valid prices, unique IDs and local photo galleries',()=>{
  expect(wenlasProducts).toHaveLength(snapshot.source_listing_count);
  expect(wenlasProducts).toHaveLength(98);
  expect(new Set(wenlasProducts.map(p=>p.source_id)).size).toBe(98);
  expect(new Set(wenlasProducts.map(p=>p.slug)).size).toBe(98);
  expect(wenlasCategories).toHaveLength(9);
  const photos=new Set<string>();
  for(const p of wenlasProducts){
    expect(productSchema.safeParse(p).success,p.name).toBe(true);
    expect(wenlasCategories.some(c=>c.id===p.category_id)).toBe(true);
    expect(p.source_url).toMatch(/^https:\/\/jiji.ng\/.*\.html$/);
    expect(p.stock).toBe(0);expect(p.inventory_status).toBe('unconfirmed');
    for(const image of p.images){expect(existsSync(join(process.cwd(),'public',image)),image).toBe(true);photos.add(image);}
  }
  expect(photos.size).toBe(snapshot.image_count);
  expect(photos.size).toBe(292);
});

it('searches, filters and paginates all imported listings without duplicates or invented stock',()=>{
  const pages=Array.from({length:Math.ceil(wenlasProducts.length/12)},(_,i)=>wenlasCatalogue('','','',i+1).products).flat();
  expect(new Set(pages.map(p=>p.id)).size).toBe(98);
  expect(wenlasCatalogue('','headphones').count).toBe(31);
  expect(wenlasCatalogue('','','',1,'',0,Number.MAX_SAFE_INTEGER,'',true).count).toBe(0);
  const search=wenlasCatalogue('zealot');expect(search.count).toBeGreaterThan(0);expect(search.products.every(p=>p.name.toLowerCase().includes('zealot'))).toBe(true);
  const prices=wenlasCatalogue('','','price-asc').products.map(p=>p.price_kobo);expect(prices).toEqual([...prices].sort((a,b)=>a-b));
  expect(wenlasCatalogue('','','',100).products).toEqual([]);
});

it('isolates Wenlas from inherited database credentials and seeds only the real catalogue',()=>{
  vi.stubEnv('WENLAS_CATALOGUE_MODE','true');vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://previous-business.supabase.co');vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','test-public-key');
  expect(configured()).toBe(false);
  const store=new LocalStore(':memory:',true);
  try{
    expect(store.list('products')).toHaveLength(98);
    expect(store.list('merchants')).toHaveLength(1);
    expect(store.list('banners')).toHaveLength(0);
    const p=wenlasProducts[0];
    store.adjustStock({id:'test-admin',role:'admin'},p.id,3,'Physical stock received');
    expect(store.get<{stock:number;inventory_status:string}>('products',p.id)).toMatchObject({stock:3,inventory_status:'confirmed'});
  }finally{store.db.close();}
  expect(defaultTheme.name).toBe('Wenlas');expect(()=>assertPublishable(defaultTheme)).not.toThrow();
});

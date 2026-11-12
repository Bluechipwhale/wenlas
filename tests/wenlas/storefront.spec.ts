import {expect,test} from '@playwright/test';
import snapshot from '../../data/wenlas-products.json';

test('shows all imported products, category counts, working search and preserved source details',async({page,request})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');await expect(page).toHaveTitle(/Wenlas Resources Ltd/);
  await expect(page.locator('.wenlas-hero')).toContainText('98 products to explore');
  await expect(page.locator('.category-tile')).toHaveCount(9);
  const ids:string[]=[];
  for(let page=1;page<=9;page++){
    const response=await request.get('/api/catalogue?page='+page);expect(response.ok()).toBe(true);
    const data=await response.json();expect(data.count).toBe(98);ids.push(...data.products.map((p:{id:string})=>p.id));
  }
  expect(new Set(ids).size).toBe(98);
  await page.goto('/products?q=zealot');await expect(page.locator('.product-card').first()).toContainText(/zealot/i);
  await page.goto('/categories/headphones');await expect(page.locator('main')).toContainText('31 products');
  const product=snapshot.products[0];await page.goto('/products/'+product.slug);
  await expect(page.locator('h1')).toHaveText(product.name);
  await expect(page.getByRole('link',{name:'Ask Wenlas on Jiji'})).toHaveAttribute('href',product.source_url);
  await expect(page.getByRole('button',{name:'Add to bag',exact:true})).toHaveCount(0);
  const thumbs=page.locator('.detail-thumbs button');await expect(thumbs).toHaveCount(product.images.length);
  await thumbs.nth(1).click();await expect(thumbs.nth(1)).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Toggle wishlist',exact:true}).click();
  await page.goto('/wishlist');await expect(page.locator('.product-card')).toContainText(product.name);
  await page.goto('/brands');await expect(page.locator('.brand-collection').first()).toBeVisible();
  await page.goto('/contact');await expect(page.locator('main')).toContainText('Wenlas Resources Ltd.');
  expect(errors).toEqual([]);
});

test('keeps the catalogue usable on mobile and installs with Wenlas branding',async({page,request})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Toggle navigation'}).click();
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Headphones',exact:true}).click();
  await expect(page).toHaveURL(/categories\/headphones/,{timeout:30000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const manifest=await(await request.get('/store.webmanifest')).json();
  expect(manifest.name).toBe('Wenlas Resources Ltd.');expect(manifest.short_name).toBe('Wenlas');
  for(const icon of manifest.icons)expect((await request.get(icon.src)).ok()).toBe(true);
});

import {afterEach,describe,expect,it,vi} from 'vitest';
import {productStructuredData,serializeStructuredData,breadcrumbStructuredData,pageMetadata} from '../src/lib/seo';
import {wenlasProducts} from '../src/lib/wenlas-catalogue';
afterEach(()=>vi.unstubAllEnvs());
describe('Wenlas search data',()=>{
 it('keeps source text safe inside a JSON script without changing its meaning',()=>{
  const input={description:'A product </script><script>alert(1)</script> and <detail>'};
  const value=serializeStructuredData(input);
  expect(value).not.toContain('<');expect(JSON.parse(value)).toEqual(input);
 });
 it('does not advertise unknown quantities as available or invent ratings',()=>{
  vi.stubEnv('NEXT_PUBLIC_SITE_URL','https://wenlas.example');
  const result=productStructuredData({...wenlasProducts[0],stock:8,inventory_status:'unconfirmed'});
  expect(result.offers).not.toHaveProperty('availability');expect(result).not.toHaveProperty('aggregateRating');
  expect(result.offers.priceCurrency).toBe('NGN');expect(result.offers.price).toBe('24000.00');
  expect(result.image.every(url=>url.startsWith('https://wenlas.example/images/'))).toBe(true);
 });
 it('uses available quantity for confirmed stock and keeps the product URL canonical',()=>{
  vi.stubEnv('NEXT_PUBLIC_SITE_URL','https://wenlas.example');
  const result=productStructuredData({...wenlasProducts[0],stock:8,reserved:8,inventory_status:'confirmed'});
  expect(result.offers.availability).toBe('https://schema.org/OutOfStock');
  expect(result.offers.url).toBe('https://wenlas.example/products/'+wenlasProducts[0].slug);
 });
 it('keeps filtered pages out of indexing while retaining navigation and safe descriptions',()=>{
  vi.stubEnv('NEXT_PUBLIC_SITE_URL','https://wenlas.example');
  const meta=pageMetadata({title:'Search',description:'<p>Audio  and\naccessories</p>',path:'/products',noindex:true});
  expect(meta.robots).toEqual({index:false,follow:true});expect(meta.description).toBe('Audio and accessories');
  const crumbs=breadcrumbStructuredData([{name:'Home',path:'/'},{name:'Headphones',path:'/categories/headphones'}]);
  expect(crumbs.itemListElement[1]).toMatchObject({position:2,item:'https://wenlas.example/categories/headphones'});
 });
});

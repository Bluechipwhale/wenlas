import snapshot from '../../data/wenlas-products.json';
import type { Category, Product, RecordRow } from './types';
import { brand } from './brand';
import { categoryScope } from './category-tree';

export const wenlasProducts: Product[] = snapshot.products.map(product=>({...product,inventory_status:'unconfirmed' as const,inquiry_only:true}));
export const wenlasCategories: Category[] = snapshot.categories;
export const wenlasMerchant: RecordRow = {
  id: 'wenlas', kind: 'merchants', created_at: snapshot.imported_at,
  data: { name: brand.fullName, status: 'approved', description: 'Audio, mobile accessories and everyday electronics from Computer Village, Ikeja, Lagos.', address: brand.address, commission_bps: 0 },
};

export function wenlasCatalogue(query = '', category = '', sort = '', page = 1, merchant = '', min = 0, max = Number.MAX_SAFE_INTEGER, brandName = '', available = false,sourceProducts:Product[]=wenlasProducts) {
  const scope = categoryScope(wenlasCategories, category);
  const products = sourceProducts.filter(p => p.active && !p.archived_at
    && (!query || `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase()))
    && (!category || scope.includes(p.category_id)) && (!merchant || p.merchant_id === merchant)
    && p.price_kobo >= min && p.price_kobo <= max && (!brandName || p.brand === brandName)
    && (!available || p.stock > p.reserved));
  products.sort((a, b) => (sort === 'price-asc' ? a.price_kobo - b.price_kobo : sort === 'price-desc' ? b.price_kobo - a.price_kobo : b.created_at.localeCompare(a.created_at)) || a.id.localeCompare(b.id));
  return { products: products.slice((page - 1) * 12, page * 12), count: products.length, categories: wenlasCategories };
}

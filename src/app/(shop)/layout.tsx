import { publishedTheme, storefrontCategories } from '@/lib/server';
import {customerCategoryLinks} from '@/lib/category-visibility';
import { StoreHeader, StoreFooter } from '@/components/store-shell';
import { themeTokens } from '@/lib/theme';
import type { CSSProperties, ReactNode } from 'react';
export default async function ShopLayout({children}:{children:ReactNode}) { const [raw,categories]=await Promise.all([publishedTheme(),storefrontCategories()]);const visible=new Set(categories.map(c=>c.id));const origin=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';const t={...raw,navigation:customerCategoryLinks(raw.navigation,visible,origin),footerLinks:customerCategoryLinks(raw.footerLinks,visible,origin)};return <div className="themed-store wenlas-store" style={themeTokens(t) as CSSProperties} data-buttons={t.buttonStyle}><a className="skip-link" href="#main-content">Skip to content</a><StoreHeader theme={t}/><main id="main-content" tabIndex={-1}>{children}</main><StoreFooter theme={t}/></div>; }

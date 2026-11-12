import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/inventory','/admin','/account','/merchant','/driver','/api','/checkout','/login','/register','/forgot-password','/reset-password','/auth','/theme-preview']},sitemap:`${process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'}/sitemap.xml`};}

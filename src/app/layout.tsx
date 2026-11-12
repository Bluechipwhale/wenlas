import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ShopProvider } from '@/components/shop-state';
import { configured, publishedTheme } from '@/lib/server';
import { AuthLanding } from '@/components/auth-landing';
import { AppLifecycle } from '@/components/app-install';
import {AccountSessionBar} from '@/components/account-session-bar';
import {LogoutSessionSync} from '@/components/logout-session-sync';
import {LiveStockProvider} from '@/components/live-stock';
import './globals.css';
export async function generateMetadata():Promise<Metadata> {const theme=await publishedTheme();return {title:{default:theme.seoTitle,template:`%s | ${theme.name}`},description:theme.seoDescription,metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),manifest:'/store.webmanifest',appleWebApp:{capable:true,title:theme.name,statusBarStyle:'default'},icons:{apple:'/brand/wenlas-official-logo.png',...(theme.favicon?{icon:theme.favicon}:{})},openGraph:{title:theme.seoTitle,description:theme.seoDescription}};}
export default async function RootLayout({children}:{children:React.ReactNode}) {await connection();return <html lang="en" data-scroll-behavior="smooth"><body><ShopProvider><LiveStockProvider><AuthLanding liveOrigin={configured()?process.env.NEXT_PUBLIC_SITE_URL:undefined}/><AppLifecycle/><LogoutSessionSync/><AccountSessionBar/>{children}</LiveStockProvider></ShopProvider></body></html>;}

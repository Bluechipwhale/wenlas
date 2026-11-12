'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, UserRound, ArrowUpRight, Menu, X, ArrowRight, MapPin, Package, Sparkles } from 'lucide-react';
import type { Theme } from '@/lib/theme';
import { useShop } from './shop-state';
import {brand} from '@/lib/brand';
export function Logo({theme}:{theme:Theme}) {
  const logo=theme.lightLogo||theme.logo;
  return <Link href="/" className="logo" aria-label={theme.name+' home'}>{logo?<picture>{theme.mobileLogo&&<source media="(max-width:768px)" srcSet={theme.mobileLogo}/>}<Image src={logo} width={244} height={64} alt={theme.name} unoptimized/></picture>:<><span className="brand-symbol"><ArrowUpRight strokeWidth={3} size={23}/></span><span>{theme.name}<span className="logo-dot">.</span></span></>}</Link>;
}
export function StoreHeader({theme,preview=false}:{theme:Theme;preview?:boolean}) {
  const {state}=useShop();const [mobile,setMobile]=useState(false);const [search,setSearch]=useState('');const [suggestions,setSuggestions]=useState<{name:string;slug:string}[]>([]);const requestId=useRef(0);
  async function searchChange(value:string){setSearch(value);const id=++requestId.current;if(value.length<2){setSuggestions([]);return;}try{const r=await fetch(`/api/catalogue?q=${encodeURIComponent(value)}`);const data=await r.json();if(id===requestId.current)setSuggestions(data.products?.slice(0,5)||[]);}catch{setSuggestions([]);}}
  return <header className={`store-header ${theme.sticky&&!preview?'sticky':''}`}>
    {theme.announcementEnabled&&<div className="announcement" style={{background:theme.announcementBackground,color:theme.announcementText}}><Sparkles size={13}/>{theme.announcementLink?<Link href={theme.announcementLink}>{theme.announcement}</Link>:theme.announcement}<ArrowRight size={14}/></div>}
    <div className="main-header container"><button className="icon-btn mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Toggle navigation" aria-expanded={mobile} aria-controls="store-navigation">{mobile?<X/>:<Menu/>}</button><Logo theme={theme}/>
      <div className="search-wrap"><form className="search-bar" action="/products"><Search size={19}/><input name="q" value={search} onChange={e=>searchChange(e.target.value)} onKeyDown={e=>{if(e.key==='Escape')setSuggestions([]);}} placeholder="Search for your next great find" aria-label="Search products" autoComplete="off"/><button type="submit" aria-label="Submit search"><ArrowRight size={18}/></button></form>{suggestions.length>0&&<div className="suggestions">{suggestions.map(s=><Link key={s.slug} href={`/products/${s.slug}`} onClick={()=>setSuggestions([])}>{s.name}<ArrowUpRight size={14}/></Link>)}</div>}</div>
      <div className="header-actions"><Link href="/account" className="account-link"><UserRound size={21}/><span><small>Hello there</small>My account</span></Link><Link href="/wishlist" className="icon-btn" aria-label={`Wishlist, ${state.wishlist.length} items`}><Heart size={22}/></Link><Link href="/cart" className="bag-link" aria-label={`Shopping bag, ${state.cart.reduce((s,c)=>s+c.quantity,0)} items`}><ShoppingBag size={22}/><span className="cart-count">{state.cart.reduce((s,c)=>s+c.quantity,0)}</span></Link></div>
    </div>
    <div className={`nav-row ${mobile?'open':''}`}><nav id="store-navigation" className="container" aria-label="Main navigation"><Link href="/products" className="all-categories"><Menu size={17}/>All categories</Link><span className="nav-divider"/>{theme.navigation.map((l,i)=><Link href={l.href} key={`${l.href}-${i}`} onClick={()=>setMobile(false)}>{l.label}</Link>)}<Link href="/account/orders" className="track-link"><Package size={16}/>Track your order</Link></nav></div>
  </header>;
}
export function StoreFooter({theme}:{theme:Theme}) {
  return <footer className="store-footer"><div className="container footer-top"><div className="footer-brand"><Logo theme={theme}/><p>{theme.description}</p><span className="tiny-label">{brand.fullName.toUpperCase()} · GOOD TECH. GREAT EVERYDAY.</span></div><div><h4>We’re here to help</h4><Link href="/contact">Contact Wenlas</Link>{theme.footerLinks.slice(0,3).map(l=><Link href={l.href} key={l.href}>{l.label}</Link>)}{theme.email&&<a href={'mailto:'+theme.email}>{theme.email}</a>}{theme.phone&&<a href={'tel:'+theme.phone}>{theme.phone}</a>}</div><div><h4>Explore Wenlas</h4><Link href="/products">All products</Link><Link href="/brands">Shop by brand</Link><Link href="/categories/headphones">Headphones & earbuds</Link><Link href="/categories/audio-and-music-equipment">Speakers & audio</Link><Link href="/wishlist">Your saved finds</Link><Link href="/apps">Get the Wenlas app</Link><Link href="/inventory">Inventory & staff</Link></div><div className="footer-note"><MapPin size={24}/><h4>Find us in Ikeja.</h4><p>{brand.address}</p><p>{brand.hours}</p><a className="text-button" href={brand.sellerUrl} target="_blank" rel="noopener noreferrer">Visit our Jiji store<ArrowUpRight size={14}/></a></div></div><div className="container footer-bottom"><span>{theme.copyright}</span><div>{theme.footerLinks.slice(3).map(l=><Link key={l.href} href={l.href}>{l.label}</Link>)}</div><span>Good tech. Great everyday. <span className="purple">↗</span></span></div></footer>;
}

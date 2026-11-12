import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, AudioLines, BatteryCharging, MapPin } from 'lucide-react';
import type { Product } from '@/lib/types';
import type { Theme } from '@/lib/theme';
import { money } from '@/lib/types';

export function WenlasHero({ theme, products, count }: { theme: Theme; products: Product[]; count: number }) {
  const main = products.find(p => /airpods max/i.test(p.name)) || products[0];
  const side = products.find(p => /zealot/i.test(p.name)) || products[1];
  return <>
    <section className="wenlas-hero container" aria-label="The Wenlas collection">
      <div className="wenlas-hero-copy">
        <span className="wenlas-eyebrow"><span className="wenlas-live-dot"/>{theme.heroEyebrow}</span>
        <h1>{theme.heroTitle.split('\n').map((line, i) => <span key={line} className={i ? 'wenlas-title-accent' : ''}>{line}</span>)}</h1>
        <p>{theme.heroText}</p>
        <div className="hero-buttons"><Link className="button" href={theme.heroLink}>{theme.heroCta}<ArrowUpRight size={18}/></Link><Link className="text-button" href={theme.heroSecondaryLink}>{theme.heroSecondary}<ArrowRight size={17}/></Link></div>
        <div className="wenlas-hero-meta"><span><MapPin size={15}/>Ikeja, Lagos</span><span className="wenlas-meta-divider"/><span>{count} products to explore</span></div>
      </div>
      <div className="wenlas-hero-display">
        <div className="wenlas-orbit" aria-hidden="true"/><span className="wenlas-display-number" aria-hidden="true">W.</span>
        {main && <Link href={`/products/${main.slug}`} className="wenlas-hero-product wenlas-hero-main"><span className="wenlas-product-kicker"><AudioLines size={16}/>YOUR SOUND. UPGRADED.</span><div className="wenlas-hero-photo" style={{position:'relative'}}><Image src={main.image} alt={main.name} fill preload sizes="(max-width:768px) 65vw, 32vw"/></div><div className="wenlas-hero-product-info"><div><span>{main.name}</span><strong>{money(main.price_kobo)}</strong></div><span className="wenlas-round-arrow"><ArrowUpRight size={18}/></span></div></Link>}
        {side && <Link href={`/products/${side.slug}`} className="wenlas-hero-product wenlas-hero-side"><div className="wenlas-side-photo" style={{position:'relative'}}><Image src={side.image} alt={side.name} fill sizes="(max-width:768px) 38vw, 17vw"/></div><div className="wenlas-hero-product-info"><div><span>{side.name}</span><strong>{money(side.price_kobo)}</strong></div><ArrowUpRight size={17}/></div></Link>}
        <span className="wenlas-sound-label"><AudioLines size={20}/>TURN EVERYDAY UP.</span>
        <span className="wenlas-display-caption">CURATED TECH. EVERYDAY POSSIBILITIES.</span>
      </div>
    </section>
    <div className="wenlas-category-strip container" aria-label="Explore the collection"><span>FIND YOUR NEXT UPGRADE</span><Link href="/categories/headphones"><AudioLines size={17}/>Better sound<ArrowUpRight size={15}/></Link><Link href="/categories/cell-phones-tablets-accessories"><BatteryCharging size={17}/>Power & essentials<ArrowUpRight size={15}/></Link><Link href="/products">Explore everything<ArrowRight size={16}/></Link></div>
  </>;
}

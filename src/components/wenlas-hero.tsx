import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,ArrowRight,Headphones,AudioLines,BatteryCharging,MapPin,Watch} from 'lucide-react';
import type {Product} from '@/lib/types';
import type {Theme} from '@/lib/theme';
import {money} from '@/lib/types';

export function WenlasHero({theme,products}:{theme:Theme;products:Product[]}){
  const main=products.find(p=>/airpods max/i.test(p.name))||products[0];
  const speaker=products.find(p=>/zealot/i.test(p.name))||products.find(p=>p.id!==main?.id);
  const power=products.find(p=>/power.?bank/i.test(p.name))||products.find(p=>p.id!==main?.id&&p.id!==speaker?.id);
  return <>
    <section className="wenlas-hero container" aria-label="The Wenlas collection">
      <div className="wenlas-hero-copy">
        <span className="wenlas-eyebrow"><span className="wenlas-live-dot"/>{theme.heroEyebrow}</span>
        <h1>{theme.heroTitle.split('\n').map((line,i)=><span key={line} className={i?'wenlas-title-accent':''}>{line}</span>)}</h1>
        <p>{theme.heroText}</p>
        <div className="hero-buttons"><Link className="button" href={theme.heroLink}>{theme.heroCta}<ArrowUpRight size={18}/></Link><Link className="text-button" href={theme.heroSecondaryLink}>{theme.heroSecondary}<ArrowRight size={17}/></Link></div>
        <div className="wenlas-hero-meta"><span><MapPin size={15}/>Ikeja, Lagos</span><span className="wenlas-meta-divider"/><span>Quality tech for everyday life</span></div>
      </div>
      <div className="wenlas-hero-display">
        <div className="wenlas-display-halo" aria-hidden="true"/>
        {main&&<Link href={`/products/${main.slug}`} className="wenlas-hero-product wenlas-hero-main">
          <div className="wenlas-product-kicker"><Headphones size={16}/><span>THE AUDIO SPOTLIGHT</span><ArrowUpRight size={16}/></div>
          <div className="wenlas-hero-photo"><Image src={main.image} alt={main.name} fill loading="eager" fetchPriority="high" sizes="(max-width:600px) 55vw, (max-width:1000px) 45vw, 26vw"/></div>
          <div className="wenlas-hero-product-info"><span>{main.name}</span><strong>{money(main.price_kobo)}</strong></div>
          <span className="wenlas-product-discover">Discover your sound<ArrowRight size={16}/></span>
        </Link>}
        {[{product:speaker,label:'Turn it up',icon:AudioLines},{product:power,label:'Stay powered',icon:BatteryCharging}].map(({product:p,label,icon:Icon})=>p&&<Link key={p.id} href={`/products/${p.slug}`} className="wenlas-hero-product wenlas-hero-mini">
          <span className="wenlas-mini-label"><Icon size={14}/>{label}<ArrowUpRight size={14}/></span>
          <div className="wenlas-mini-photo"><Image src={p.image} alt={p.name} fill sizes="(max-width:600px) 26vw, (max-width:1000px) 22vw, 14vw"/></div>
          <div className="wenlas-hero-product-info"><span>{p.name}</span><strong>{money(p.price_kobo)}</strong></div>
        </Link>)}
      </div>
    </section>
    <nav className="wenlas-category-strip container" aria-label="Explore the collection"><span>WHAT ARE YOU INTO?</span><Link href="/categories/headphones"><Headphones size={18}/>Headphones & earbuds<ArrowUpRight size={15}/></Link><Link href="/categories/audio-and-music-equipment"><AudioLines size={18}/>Speakers & audio<ArrowUpRight size={15}/></Link><Link href="/categories/cell-phones-tablets-accessories"><BatteryCharging size={18}/>Power & essentials<ArrowUpRight size={15}/></Link><Link href="/categories/smart-watches"><Watch size={18}/>Smart watches<ArrowUpRight size={15}/></Link></nav>
  </>;
}

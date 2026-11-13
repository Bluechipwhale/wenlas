import Link from 'next/link';
import {ArrowUpRight,MapPin,Headphones,PlugZap} from 'lucide-react';
import {brand} from '@/lib/brand';
export function WenlasStoreStory(){
 return <section className="wenlas-store-story container" aria-label="Visit Wenlas in Ikeja"><div><span className="eyebrow">GOOD FINDS. REAL CONNECTIONS.</span><h2>Your next find.<br/>Right here in Ikeja.</h2><p>Explore audio, mobile accessories and everyday electronics from Wenlas Resources Ltd. Discover online, then talk to our team about your next upgrade.</p><Link className="button" href="/contact">Meet Wenlas<ArrowUpRight size={17}/></Link></div><div className="wenlas-address-card"><div className="wenlas-story-icons" aria-hidden="true"><Headphones/><PlugZap/><MapPin/></div><span>FIND US AT COMPUTER VILLAGE</span><h3>Come for the tech.<br/>Stay for the possibilities.</h3><p>{brand.address}</p><a href={brand.sellerUrl} target="_blank" rel="noopener noreferrer">Visit our Jiji store<ArrowUpRight size={17}/></a></div></section>;
}

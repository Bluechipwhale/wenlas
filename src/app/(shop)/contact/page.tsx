import {pageMetadata} from '@/lib/seo';
import Link from 'next/link';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { brand, wenlasCatalogueMode } from '@/lib/brand';
import { configured, supabase } from '@/lib/server';
import { ContactForm } from '@/components/support-forms';
export const metadata=pageMetadata({title:'Visit Wenlas in Computer Village, Ikeja',description:'Find Wenlas Resources Ltd. at 8 Idowu Lane, Chelsea Plaza, Computer Village, Ikeja, Lagos. Talk to our team about audio, mobile accessories and electronics.',path:'/contact'});
export default async function Page() {
  if (wenlasCatalogueMode()) return <div className="container narrow-page"><span className="eyebrow">LET’S FIND YOUR NEXT UPGRADE</span><h1>Talk to Wenlas.</h1><p>Ask about a product, confirm availability or plan a visit to our store.</p><section className="form-panel"><h2>{brand.fullName}</h2><p><MapPin size={18}/> {brand.address}</p><p><Clock size={18}/> {brand.hours}</p><a className="button" href={brand.sellerUrl} target="_blank" rel="noopener noreferrer">Contact Wenlas on Jiji<ArrowUpRight size={17}/></a></section><p>Prices and availability can change. Confirm your product and collection or delivery arrangements with Wenlas before payment.</p><Link className="text-button" href="/products">Back to the collection →</Link></div>;
  const user=configured()?(await(await supabase()).auth.getUser()).data.user:null;
  return <div className="container narrow-page"><span className="eyebrow">HERE TO HELP</span><h1>Let’s sort it out.</h1><p>Ask about an order, delivery or product.</p><ContactForm email={user?.email||''}/></div>;
}

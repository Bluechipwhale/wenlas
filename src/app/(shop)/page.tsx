import {homepageCatalogue,publishedTheme,records} from '@/lib/server';
import {liveDealPlacements} from '@/lib/live-deals';
import {homepageProductAllowed} from '@/lib/homepage-products';
import {Storefront} from '@/components/storefront';
import {pageMetadata} from '@/lib/seo';
export const metadata={...pageMetadata({title:'Wenlas Resources Ltd. | Headphones, Speakers & Accessories',description:'Discover headphones, earbuds, Bluetooth speakers, power banks and smart accessories at Wenlas Resources Ltd. Visit our Computer Village store in Ikeja, Lagos.',path:'/'}),title:{absolute:'Wenlas Resources Ltd. | Headphones, Speakers & Accessories'}};
export default async function Home(){const [data,theme,banners,merchants,deals]=await Promise.all([homepageCatalogue(),publishedTheme(),records('banners',true),records('merchants',true),liveDealPlacements()]);return <Storefront theme={theme} {...data} banners={banners} merchants={merchants} deals={deals.map(d=>({...d,products:d.products.filter(homepageProductAllowed)}))}/>;}

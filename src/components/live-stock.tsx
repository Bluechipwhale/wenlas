'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import type {Product} from '@/lib/types';
type Stock={id:string;available:number;confirmed:boolean;updated_at:string};
const Context=createContext<Map<string,Stock>>(new Map());
export function LiveStockProvider({children}:{children:React.ReactNode}){
 const [stocks,setStocks]=useState<Map<string,Stock>>(new Map());
 useEffect(()=>{let stopped=false,busy=false;const controller=new AbortController();async function update(){if(busy||document.hidden)return;busy=true;try{const response=await fetch('/api/stock',{cache:'no-store',signal:controller.signal});if(response.ok){const data=await response.json();if(!stopped&&data.connected)setStocks(new Map(data.stocks.map((s:Stock)=>[s.id,s])));}}catch{}finally{busy=false;}}void update();const timer=setInterval(update,3000);document.addEventListener('visibilitychange',update);return()=>{stopped=true;controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',update);};},[]);
 return <Context.Provider value={stocks}>{children}</Context.Provider>;
}
export function useLiveStock(product:Product){const stock=useContext(Context).get(product.id);return stock?{...product,stock:stock.available,reserved:0,inventory_status:stock.confirmed?'confirmed' as const:'unconfirmed' as const}:product;}

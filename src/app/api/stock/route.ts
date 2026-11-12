import {NextResponse} from 'next/server';
import {inventoryDatabase,liveInventoryConfigured} from '@/lib/inventory-database';
import {InventoryService} from '@/lib/inventory-service';
export const dynamic='force-dynamic';
export async function GET(){
 if(!liveInventoryConfigured())return NextResponse.json({connected:false,stocks:[]},{headers:{'Cache-Control':'no-store'}});
 try{const stocks=await new InventoryService(await inventoryDatabase()).stocks();return NextResponse.json({connected:true,stocks:stocks.map(s=>({id:s.product_id,available:Math.max(0,s.on_hand-s.reserved),confirmed:Boolean(s.confirmed),updated_at:s.updated_at}))},{headers:{'Cache-Control':'no-store'}});}
 catch{return NextResponse.json({error:'Stock updates are temporarily unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}

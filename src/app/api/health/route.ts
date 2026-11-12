import { NextResponse } from 'next/server';
import {wenlasCatalogueMode} from '@/lib/brand';
import {wenlasProducts} from '@/lib/wenlas-catalogue';
import {inventoryDatabase,liveInventoryConfigured} from '@/lib/inventory-database';
import {InventoryService} from '@/lib/inventory-service';
import { configured } from '@/lib/server';
import { createClient } from '@supabase/supabase-js';
export async function GET() {
  if(wenlasCatalogueMode()){
    let inventory='not-configured';
    if(liveInventoryConfigured()){try{await new InventoryService(await inventoryDatabase()).stocks();inventory='connected';}catch{inventory='unavailable';}}
    return NextResponse.json({status:inventory==='unavailable'?'unavailable':'ok',mode:'catalogue',products:wenlasProducts.length,checkout:false,inventory},{status:inventory==='unavailable'?503:200,headers:{'Cache-Control':'no-store'}});
  }
  let ready=false;
  if(configured()){
    try{
      const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
      const {data,error}=await db.from('website_settings').select('id').eq('id','published').abortSignal(AbortSignal.timeout(5000)).single();
      ready=!error&&data?.id==='published';
    }catch{}
  }
  return NextResponse.json({status:ready?'ok':'unavailable'},{status:ready?200:503,headers:{'Cache-Control':'no-store'}});
}

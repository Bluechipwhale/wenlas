import { NextResponse } from 'next/server';
import { z } from 'zod';
import { localMode,supabase,configured,currentWenlasProducts } from '@/lib/server';
import { localStore } from '@/lib/local-store';
import type { Product } from '@/lib/types';
import { failure } from '@/lib/http';
import {wenlasCatalogueMode} from '@/lib/brand';
import {liveInventoryConfigured} from '@/lib/inventory-database';
import {wenlasProducts} from '@/lib/wenlas-catalogue';
export async function GET(req:Request){try{const ids=z.array(z.string().min(1).max(100)).max(100).parse(new URL(req.url).searchParams.getAll('id'));if(!ids.length)return NextResponse.json([]);if(wenlasCatalogueMode()&&liveInventoryConfigured())return NextResponse.json((await currentWenlasProducts()).filter(p=>p.active&&ids.includes(p.id)));if(await localMode())return NextResponse.json(localStore().list<Product>('products').filter(p=>p.active&&ids.includes(p.id)));if(!configured())return NextResponse.json(wenlasCatalogueMode()?wenlasProducts.filter(p=>p.active&&ids.includes(p.id)):[]);const {data,error}=await(await supabase()).from('storefront_products').select('*').eq('active',true).in('id',ids);if(error)throw new Error('Saved products unavailable');return NextResponse.json(data);}catch(e){return failure(e);}}

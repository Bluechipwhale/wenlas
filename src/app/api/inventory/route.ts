import {NextResponse} from 'next/server';
import {requireInventoryUser} from '@/lib/inventory-auth';
import {inventoryDatabase} from '@/lib/inventory-database';
import {InventoryService} from '@/lib/inventory-service';
import {wenlasProducts,wenlasCategories} from '@/lib/wenlas-catalogue';
import {guard,failure} from '@/lib/http';
export const dynamic='force-dynamic';
export async function GET(){try{const user=await requireInventoryUser(),data=await new InventoryService(await inventoryDatabase()).snapshot();return NextResponse.json({...data,user,products:wenlasProducts,categories:wenlasCategories},{headers:{'Cache-Control':'private, no-store'}});}catch(error){return failure(error);}}
export async function POST(request:Request){try{guard(request);const user=await requireInventoryUser();if(user.role==='viewer')throw Error('Forbidden');const text=await request.text();if(text.length>4000)throw Error('Request is too large');const result=await new InventoryService(await inventoryDatabase()).adjust(user.email,JSON.parse(text));return NextResponse.json(result,{headers:{'Cache-Control':'private, no-store'}});}catch(error){return failure(error);}}

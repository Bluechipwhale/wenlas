import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {z} from 'zod';
import {InventoryAuth,inventoryCookie} from '@/lib/inventory-auth';
import {inventoryDatabase} from '@/lib/inventory-database';
import {guard,failure} from '@/lib/http';
export const dynamic='force-dynamic';
const inputSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('login'),email:z.email().max(254),password:z.string().min(1).max(128)}).strict(),
 z.object({action:z.literal('setup'),email:z.email().max(254),password:z.string().min(12).max(128),token:z.string().min(32).max(200)}).strict(),
 z.object({action:z.literal('logout')}).strict(),
 z.object({action:z.literal('accept-invite'),token:z.string().min(32).max(200),password:z.string().min(12).max(128)}).strict(),
]);
export async function GET(){try{const auth=new InventoryAuth(await inventoryDatabase()),user=await auth.user((await cookies()).get(inventoryCookie)?.value);return NextResponse.json({user,setupRequired:!await auth.hasOwner()},{headers:{'Cache-Control':'private, no-store'}});}catch{return NextResponse.json({error:'Inventory database is not connected yet'},{status:503,headers:{'Cache-Control':'no-store'}});}}
export async function POST(request:Request){try{
 guard(request);const text=await request.text();if(text.length>6000)throw Error('Request is too large');const input=inputSchema.parse(JSON.parse(text)),auth=new InventoryAuth(await inventoryDatabase());
 if(input.action==='logout'){await auth.logout((await cookies()).get(inventoryCookie)?.value);const response=NextResponse.json({ok:true});response.cookies.set(inventoryCookie,'',{path:'/',maxAge:0,httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production'});return response;}
 const result=input.action==='setup'?await auth.setup(input.email,input.password,input.token,process.env.WENLAS_SETUP_TOKEN||'',process.env.WENLAS_OWNER_EMAIL):input.action==='accept-invite'?await auth.acceptInvite(input.token,input.password):await auth.login(input.email,input.password);
 const response=NextResponse.json({ok:true,user:result.user},{headers:{'Cache-Control':'private, no-store'}});response.cookies.set(inventoryCookie,result.token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',expires:result.expires});return response;
}catch(error){return failure(error);}}

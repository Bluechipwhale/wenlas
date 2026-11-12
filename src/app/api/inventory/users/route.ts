import {NextResponse} from 'next/server';
import {z} from 'zod';
import {InventoryAuth,requireInventoryUser,inventoryCookie} from '@/lib/inventory-auth';
import {inventoryDatabase} from '@/lib/inventory-database';
import {guard,failure} from '@/lib/http';
const schema=z.discriminatedUnion('action',[
 z.object({action:z.literal('invite'),email:z.email().max(254),role:z.enum(['manager','viewer'])}).strict(),
 z.object({action:z.literal('edit'),id:z.uuid(),email:z.email().max(254),role:z.enum(['manager','viewer']),disabled:z.boolean(),password:z.string().max(128).optional()}).strict(),
]);
export async function GET(){try{const user=await requireInventoryUser(),auth=new InventoryAuth(await inventoryDatabase());return NextResponse.json({users:await auth.users(user)},{headers:{'Cache-Control':'private, no-store'}});}catch(error){return failure(error);}}
export async function POST(request:Request){try{guard(request);const user=await requireInventoryUser();if(user.role!=='owner')throw Error('Forbidden');const body=await request.text();if(body.length>4000)throw Error('Request is too large');const input=schema.parse(JSON.parse(body)),auth=new InventoryAuth(await inventoryDatabase());const result=input.action==='invite'?await auth.invite(user,input.email,input.role):await auth.editUser(user,input.id,input.email,input.role,input.disabled,input.password);const response=NextResponse.json(result,{headers:{'Cache-Control':'private, no-store'}});if('signOut'in result&&result.signOut)response.cookies.set(inventoryCookie,'',{path:'/',maxAge:0});return response;}catch(error){return failure(error);}}

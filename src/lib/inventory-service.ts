import 'server-only';
import {createHash,randomUUID} from 'node:crypto';
import {z} from 'zod';
import type {InventoryDatabase} from './inventory-database';
import {wenlasProducts} from './wenlas-catalogue';
import type {Product} from './types';

export type StockRow={product_id:string;on_hand:number;reserved:number;reorder_level:number;confirmed:number;revision:number;updated_at:string};
export type StockMovement={id:string;product_id:string;kind:string;quantity:number;before_stock:number;after_stock:number;before_threshold:number;after_threshold:number;reason:string;actor_email:string;created_at:string};
export const inventoryMutation=z.object({id:z.uuid(),product_id:z.string().min(1).max(100),kind:z.enum(['receive','sale','remove','count','threshold']),quantity:z.number().int().min(0).max(1000000),reason:z.string().trim().min(3).max(500),expected_revision:z.number().int().nonnegative().optional()}).strict();
export type InventoryMutation=z.infer<typeof inventoryMutation>;
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');

export class InventoryService{
 constructor(private database:InventoryDatabase){}
 async snapshot(){return this.database.transaction(async query=>{
  const stocks=await query<StockRow>('SELECT * FROM wenlas_inventory ORDER BY product_id');
  const movements=await query<StockMovement>('SELECT id,product_id,kind,quantity,before_stock,after_stock,before_threshold,after_threshold,reason,actor_email,created_at FROM wenlas_stock_movements ORDER BY created_at DESC,id DESC LIMIT 100');
  return {stocks,movements,updated_at:new Date().toISOString()};
 });}
 async stocks(){return this.database.transaction(query=>query<StockRow>('SELECT * FROM wenlas_inventory ORDER BY product_id'));}
 async adjust(actorEmail:string,raw:unknown){
  const input=inventoryMutation.parse(raw);
  if(!wenlasProducts.some(p=>p.id===input.product_id))throw Error('Product not found');
  if(['receive','sale','remove'].includes(input.kind)&&input.quantity===0)throw Error('Enter a quantity greater than zero');
  if(input.kind==='count'&&input.expected_revision===undefined)throw Error('Refresh stock before recording a count');
  const requestHash=hash(JSON.stringify({...input,actorEmail}));
  return this.database.transaction(async query=>{
   const rows=await query<StockRow>('SELECT * FROM wenlas_inventory WHERE product_id=? FOR UPDATE',[input.product_id]);
   const stock=rows[0];if(!stock)throw Error('Product not found');
   const previous=await query<StockMovement&{request_hash:string}>('SELECT * FROM wenlas_stock_movements WHERE id=?',[input.id]);
   if(previous[0]){if(previous[0].request_hash!==requestHash)throw Error('Request ID was already used for a different adjustment');return {stock,movement:previous[0],replayed:true};}
   if(input.kind==='count'&&stock.revision!==input.expected_revision)throw Error('Stock changed since you opened this count. Refresh and check it again.');
   const delta=input.kind==='receive'?input.quantity:input.kind==='sale'||input.kind==='remove'?-input.quantity:input.kind==='count'?input.quantity-stock.on_hand:0;
   const next=stock.on_hand+delta,threshold=input.kind==='threshold'?input.quantity:stock.reorder_level;
   if(next<stock.reserved)throw Error('Insufficient available stock. Reserved stock cannot be removed.');
   if(next>1000000)throw Error('Stock exceeds the supported quantity');
   const updated_at=new Date().toISOString();
   await query('UPDATE wenlas_inventory SET on_hand=?,reorder_level=?,confirmed=?,revision=revision+1,updated_at=? WHERE product_id=?',[next,threshold,input.kind==='threshold'?stock.confirmed:1,updated_at,stock.product_id]);
   await query('INSERT INTO wenlas_stock_movements(id,product_id,kind,quantity,before_stock,after_stock,before_threshold,after_threshold,reason,actor_email,request_hash,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',[input.id,stock.product_id,input.kind,delta,stock.on_hand,next,stock.reorder_level,threshold,input.reason,actorEmail,requestHash,updated_at]);
   const [current]=await query<StockRow>('SELECT * FROM wenlas_inventory WHERE product_id=?',[stock.product_id]);
   return {stock:current,movement:{id:input.id,product_id:stock.product_id,kind:input.kind,quantity:delta,before_stock:stock.on_hand,after_stock:next,before_threshold:stock.reorder_level,after_threshold:threshold,reason:input.reason,actor_email:actorEmail,created_at:updated_at},replayed:false};
  });
 }
}

export function overlayInventory(products:Product[],stocks:StockRow[]):Product[]{const byId=new Map(stocks.map(s=>[s.product_id,s]));return products.map(p=>{const s=byId.get(p.id);return s?{...p,stock:s.on_hand,reserved:s.reserved,reorder_level:s.reorder_level,inventory_status:s.confirmed?'confirmed':'unconfirmed',inquiry_only:true}:p;});}
export const newInventoryRequestId=()=>randomUUID();

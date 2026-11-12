import {requireInventoryUser} from '@/lib/inventory-auth';
import {inventoryDatabase} from '@/lib/inventory-database';
import {InventoryService} from '@/lib/inventory-service';
import {wenlasProducts} from '@/lib/wenlas-catalogue';
import {failure} from '@/lib/http';
export async function GET(){try{await requireInventoryUser();const data=await new InventoryService(await inventoryDatabase()).stocks(),products=new Map(wenlasProducts.map(p=>[p.id,p]));const cell=(value:unknown)=>'"'+String(value??'').replace(/^[=+@\-]/,"'$&").replaceAll('"','""')+'"';const lines=[['SKU','Product','Brand','On hand','Reserved','Available','Reorder level','Stock confirmed','Updated at'],...data.map(s=>[s.product_id,products.get(s.product_id)?.name,products.get(s.product_id)?.brand,s.on_hand,s.reserved,s.on_hand-s.reserved,s.reorder_level,s.confirmed?'Yes':'No',s.updated_at])];return new Response('\ufeff'+lines.map(row=>row.map(cell).join(',')).join('\r\n'),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="wenlas-inventory.csv"','Cache-Control':'private, no-store'}});}catch(error){return failure(error);}}

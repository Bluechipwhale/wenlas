import {afterEach,beforeEach,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {createInventoryDatabase,type InventoryDatabase} from '../src/lib/inventory-database';
import {InventoryService,overlayInventory} from '../src/lib/inventory-service';
import {InventoryAuth,passwordMatches} from '../src/lib/inventory-auth';
import {wenlasProducts} from '../src/lib/wenlas-catalogue';
let database:InventoryDatabase,service:InventoryService;
const product=wenlasProducts[0],ownerEmail='owner@example.com',setupToken='private-test-setup-code-1234567890123456789',password='A private test password 284!';
const mutation=(kind:string,quantity:number,extra:Record<string,unknown>={})=>({id:randomUUID(),product_id:product.id,kind,quantity,reason:'Verified stock operation',...extra});
beforeEach(async()=>{database=await createInventoryDatabase({sqlitePath:':memory:'});service=new InventoryService(database);});
afterEach(async()=>database.close());

it('starts all 98 imported listings with unconfirmed quantities and no invented inventory',async()=>{
 const data=await service.snapshot();expect(data.stocks).toHaveLength(98);expect(data.stocks.every(s=>s.on_hand===0&&s.reserved===0&&!s.confirmed)).toBe(true);expect(data.movements).toEqual([]);
});
it('records receipts once, detects conflicting retries and retains an auditable before/after balance',async()=>{
 const input=mutation('receive',12);await service.adjust(ownerEmail,input);expect((await service.adjust(ownerEmail,input)).replayed).toBe(true);
 await expect(service.adjust(ownerEmail,{...input,quantity:13})).rejects.toThrow('different adjustment');
 const data=await service.snapshot();expect(data.stocks.find(s=>s.product_id===product.id)).toMatchObject({on_hand:12,confirmed:1,revision:1});expect(data.movements).toHaveLength(1);expect(data.movements[0]).toMatchObject({before_stock:0,after_stock:12,quantity:12,actor_email:ownerEmail});
});
it('serializes simultaneous sales so two staff cannot oversell the same stock',async()=>{
 await service.adjust(ownerEmail,mutation('receive',10));
 const results=await Promise.allSettled([service.adjust('first@example.com',mutation('sale',7)),service.adjust('second@example.com',mutation('sale',7))]);
 expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(results.filter(r=>r.status==='rejected')).toHaveLength(1);
 const data=await service.snapshot();expect(data.stocks.find(s=>s.product_id===product.id)?.on_hand).toBe(3);expect(data.movements).toHaveLength(2);
});
it('rejects stale physical counts and protects reserved stock',async()=>{
 await service.adjust(ownerEmail,mutation('receive',10));const before=(await service.stocks()).find(s=>s.product_id===product.id)!;
 await service.adjust(ownerEmail,mutation('receive',2));await expect(service.adjust(ownerEmail,mutation('count',8,{expected_revision:before.revision}))).rejects.toThrow('Stock changed');
 await database.transaction(q=>q('UPDATE wenlas_inventory SET reserved=9 WHERE product_id=?',[product.id]));
 await expect(service.adjust(ownerEmail,mutation('remove',4))).rejects.toThrow('Reserved stock');
 expect((await service.stocks()).find(s=>s.product_id===product.id)?.on_hand).toBe(12);
});
it('updates reorder thresholds without confirming stock, then exposes a confirmed stock count to the storefront',async()=>{
 await service.adjust(ownerEmail,mutation('threshold',5));let row=(await service.stocks()).find(s=>s.product_id===product.id)!;expect(row.confirmed).toBe(0);expect(row.reorder_level).toBe(5);
 await service.adjust(ownerEmail,mutation('count',4,{expected_revision:row.revision}));row=(await service.stocks()).find(s=>s.product_id===product.id)!;
 expect(overlayInventory([product],[row])[0]).toMatchObject({stock:4,reorder_level:5,inventory_status:'confirmed',inquiry_only:true});
 await expect(service.adjust(ownerEmail,mutation('receive',0))).rejects.toThrow('greater than zero');
});
it('protects first-owner setup, stores password hashes and revokes signed-out sessions',async()=>{
 const auth=new InventoryAuth(database);await expect(auth.setup(ownerEmail,password,'wrong',setupToken)).rejects.toThrow('invalid');await expect(auth.setup('wrong@example.com',password,setupToken,setupToken,ownerEmail)).rejects.toThrow('owner email');
 const session=await auth.setup(ownerEmail,password,setupToken,setupToken,ownerEmail);expect(session.user.role).toBe('owner');
 const [saved]=await database.transaction(q=>q<{password_hash:string}>('SELECT password_hash FROM wenlas_inventory_users'));expect(saved.password_hash).not.toContain(password);expect(await passwordMatches(password,saved.password_hash)).toBe(true);
 expect(await auth.user(session.token)).toEqual(session.user);await auth.logout(session.token);expect(await auth.user(session.token)).toBe(null);
 await expect(auth.setup(ownerEmail,password,setupToken,setupToken)).rejects.toThrow('already configured');
});
it('supports client invitations, role limits, editable emails and immediate access revocation',async()=>{
 const auth=new InventoryAuth(database),owner=await auth.setup(ownerEmail,password,setupToken,setupToken);
 const invite=await auth.invite(owner.user,'client@example.com','viewer'),client=await auth.acceptInvite(invite.token,password);expect(client.user.role).toBe('viewer');
 await expect(auth.acceptInvite(invite.token,password)).rejects.toThrow('already been used');await expect(auth.invite(client.user,'other@example.com','manager')).rejects.toThrow('Forbidden');
 await auth.editUser(owner.user,client.user.id,'updated-client@example.com','manager',false);expect(await auth.user(client.token)).toBe(null);
 const updated=await auth.login('updated-client@example.com',password);expect(updated.user.role).toBe('manager');
 await auth.editUser(owner.user,updated.user.id,updated.user.email,'manager',true);expect(await auth.user(updated.token)).toBe(null);await expect(auth.login(updated.user.email,password)).rejects.toThrow('incorrect');
 await expect(auth.editUser(owner.user,owner.user.id,'new-owner@example.com','manager',false,'incorrect password')).rejects.toThrow('current password');
 await auth.editUser(owner.user,owner.user.id,'new-owner@example.com','manager',false,password);expect(await auth.user(owner.token)).toBe(null);expect((await auth.login('new-owner@example.com',password)).user.role).toBe('owner');
});
it('rate limits repeated failed sign-ins without revealing whether an email exists',async()=>{
 const auth=new InventoryAuth(database);for(let i=0;i<8;i++)await expect(auth.login('unknown@example.com','wrong')).rejects.toThrow('incorrect');await expect(auth.login('unknown@example.com','wrong')).rejects.toThrow('Too many');
});
it('lets each team member change their password and revokes every old session',async()=>{
 const auth=new InventoryAuth(database),owner=await auth.setup(ownerEmail,password,setupToken,setupToken);
 const next='A new private password 385!';await expect(auth.changePassword(owner.user,'wrong password',next)).rejects.toThrow('incorrect');expect(await auth.user(owner.token)).toEqual(owner.user);
 await auth.changePassword(owner.user,password,next);expect(await auth.user(owner.token)).toBe(null);await expect(auth.login(ownerEmail,password)).rejects.toThrow('incorrect');expect((await auth.login(ownerEmail,next)).user.email).toBe(ownerEmail);
});

import 'server-only';
import {createHash,randomBytes,randomUUID,scrypt,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {inventoryDatabase,type InventoryDatabase} from './inventory-database';

export const inventoryCookie='wenlas_inventory_session';
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
const derive=(password:string,salt:string)=>new Promise<Buffer>((resolve,reject)=>scrypt(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(error,key)=>error?reject(error):resolve(key)));
export async function passwordHash(password:string){const salt=randomBytes(16).toString('hex');return 'scrypt$'+salt+'$'+(await derive(password,salt)).toString('hex');}
export async function passwordMatches(password:string,encoded:string){const [,salt,value]=encoded.split('$');if(!/^[a-f0-9]{32}$/.test(salt||'')||!/^[a-f0-9]{128}$/.test(value||''))return false;const actual=await derive(password,salt);return timingSafeEqual(actual,Buffer.from(value,'hex'));}
export type InventoryUser={id:string;email:string;role:'owner'|'manager'|'viewer'};

export class InventoryAuth{
 constructor(private database:InventoryDatabase){}
 async hasOwner(){return this.database.transaction(async query=>Number((await query<{count:number}>('SELECT COUNT(*) AS count FROM wenlas_inventory_users'))[0].count)>0);}
 async setup(email:string,password:string,token:string,expectedToken:string,ownerEmail?:string){
  if(expectedToken.length<32||token.length>200||!timingSafeEqual(Buffer.from(digest(token)),Buffer.from(digest(expectedToken))))throw Error('The private setup code is invalid');
  email=email.trim().toLowerCase();
  if(ownerEmail&&email!==ownerEmail.trim().toLowerCase())throw Error('Use the configured Wenlas owner email');
  const encoded=await passwordHash(password),user:InventoryUser={id:randomUUID(),email,role:'owner'};
  await this.database.transaction(async query=>{
   await query('SELECT id FROM wenlas_inventory_bootstrap WHERE id=1 FOR UPDATE');
   if(Number((await query<{count:number}>('SELECT COUNT(*) AS count FROM wenlas_inventory_users'))[0].count))throw Error('The inventory owner is already configured. Sign in instead.');
   await query('INSERT INTO wenlas_inventory_users(id,email,password_hash,role,created_at) VALUES(?,?,?,?,?)',[user.id,email,encoded,user.role,new Date().toISOString()]);
  });
  return this.createSession(user);
 }
 private async createSession(user:InventoryUser){
  const token=randomBytes(32).toString('base64url'),expires=new Date(Date.now()+24*60*60*1000);
  await this.database.transaction(async query=>{await query('DELETE FROM wenlas_inventory_sessions WHERE expires_at<?',[new Date().toISOString()]);await query('INSERT INTO wenlas_inventory_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)',[digest(token),user.id,expires.toISOString()]);});
  return {user,token,expires};
 }
 async login(email:string,password:string){
  email=email.trim().toLowerCase();const key=digest(email),now=Date.now();
  await this.database.transaction(async query=>{
   const [attempt]=await query<{attempts:number;reset_at:number}>('SELECT * FROM wenlas_auth_attempts WHERE attempt_key=? FOR UPDATE',[key]);
   if(attempt&&Number(attempt.reset_at)>now&&attempt.attempts>=8)throw Error('Too many sign-in attempts. Try again in 15 minutes.');
   if(attempt)await query('UPDATE wenlas_auth_attempts SET attempts=?,reset_at=? WHERE attempt_key=?',[Number(attempt.reset_at)>now?attempt.attempts+1:1,Number(attempt.reset_at)>now?Number(attempt.reset_at):now+15*60*1000,key]);
   else await query('INSERT INTO wenlas_auth_attempts(attempt_key,attempts,reset_at) VALUES(?,?,?)',[key,1,now+15*60*1000]);
  });
  const [user]=await this.database.transaction(query=>query<InventoryUser&{password_hash:string}>('SELECT id,email,role,password_hash FROM wenlas_inventory_users WHERE email=? AND disabled=0',[email]));
  const valid=user?await passwordMatches(password,user.password_hash):(await derive(password,'00000000000000000000000000000000'),false);
  if(!valid)throw Error('Email or password is incorrect');
  await this.database.transaction(query=>query('DELETE FROM wenlas_auth_attempts WHERE attempt_key=?',[key]));
  return this.createSession({id:user.id,email:user.email,role:user.role});
 }
 async user(token:string|undefined){
  if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
  return this.database.transaction(async query=>(await query<InventoryUser>('SELECT u.id,u.email,u.role FROM wenlas_inventory_users u JOIN wenlas_inventory_sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>? AND u.disabled=0',[digest(token),new Date().toISOString()]))[0]||null);
 }
 async logout(token:string|undefined){if(token)await this.database.transaction(query=>query('DELETE FROM wenlas_inventory_sessions WHERE token_hash=?',[digest(token)]));}
 async users(actor:InventoryUser){if(actor.role!=='owner')throw Error('Forbidden');return this.database.transaction(query=>query<InventoryUser&{disabled:number;created_at:string}>('SELECT id,email,role,disabled,created_at FROM wenlas_inventory_users ORDER BY created_at'));}
 async invite(actor:InventoryUser,email:string,role:'manager'|'viewer'){
  if(actor.role!=='owner')throw Error('Forbidden');email=email.trim().toLowerCase();
  const token=randomBytes(32).toString('base64url');
  await this.database.transaction(async query=>{if((await query('SELECT id FROM wenlas_inventory_users WHERE email=?',[email])).length)throw Error('This email already has an account. Edit that account instead.');await query('INSERT INTO wenlas_inventory_invites(token_hash,email,role,expires_at,created_by) VALUES(?,?,?,?,?)',[digest(token),email,role,new Date(Date.now()+7*24*60*60*1000).toISOString(),actor.id]);});
  return {token,email,role};
 }
 async acceptInvite(token:string,password:string){
  const encoded=await passwordHash(password);
  const user=await this.database.transaction(async query=>{
   const [invite]=await query<{email:string;role:'manager'|'viewer';expires_at:string;accepted_at:string|null}>('SELECT * FROM wenlas_inventory_invites WHERE token_hash=? FOR UPDATE',[digest(token)]);
   if(!invite||invite.accepted_at||invite.expires_at<new Date().toISOString())throw Error('This invitation has expired or has already been used');
   if((await query('SELECT id FROM wenlas_inventory_users WHERE email=?',[invite.email])).length)throw Error('This email already has an account');
   const user:InventoryUser={id:randomUUID(),email:invite.email,role:invite.role};
   await query('INSERT INTO wenlas_inventory_users(id,email,password_hash,role,created_at) VALUES(?,?,?,?,?)',[user.id,user.email,encoded,user.role,new Date().toISOString()]);
   await query('UPDATE wenlas_inventory_invites SET accepted_at=? WHERE token_hash=?',[new Date().toISOString(),digest(token)]);return user;
  });return this.createSession(user);
 }
 async editUser(actor:InventoryUser,id:string,email:string,role:'manager'|'viewer',disabled:boolean,password?:string){
  if(actor.role!=='owner')throw Error('Forbidden');email=email.trim().toLowerCase();
  if(id===actor.id){const [self]=await this.database.transaction(query=>query<{password_hash:string}>('SELECT password_hash FROM wenlas_inventory_users WHERE id=?',[id]));if(!password||!await passwordMatches(password,self.password_hash))throw Error('Enter your current password to change your email');if(disabled)throw Error('The owner account cannot be disabled');}
  await this.database.transaction(async query=>{
   const [target]=await query<InventoryUser>('SELECT id,email,role FROM wenlas_inventory_users WHERE id=? FOR UPDATE',[id]);if(!target)throw Error('Account not found');
   if(target.role==='owner'&&target.id!==actor.id)throw Error('The owner account is protected');
   if((await query('SELECT id FROM wenlas_inventory_users WHERE email=? AND id<>?',[email,id])).length)throw Error('This email is already used by another account');
   await query('UPDATE wenlas_inventory_users SET email=?,role=?,disabled=? WHERE id=?',[email,target.role==='owner'?'owner':role,disabled?1:0,id]);
   await query('DELETE FROM wenlas_inventory_sessions WHERE user_id=?',[id]);
  });return {ok:true,signOut:id===actor.id};
 }
}

export async function currentInventoryUser(){const token=(await cookies()).get(inventoryCookie)?.value;if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token))return null;return new InventoryAuth(await inventoryDatabase()).user(token);}
export async function requireInventoryUser(){const user=await currentInventoryUser();if(!user)throw Error('Authentication required');return user;}

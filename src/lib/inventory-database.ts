import 'server-only';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {createPool,type Pool} from 'mysql2/promise';
import {wenlasProducts} from './wenlas-catalogue';

export type SqlValue=string|number|null;
export type Query=<T=Record<string,unknown>>(sql:string,values?:SqlValue[])=>Promise<T[]>;
export interface InventoryDatabase{transaction<T>(work:(query:Query)=>Promise<T>):Promise<T>;close():Promise<void>}

const tables=[
 `CREATE TABLE IF NOT EXISTS wenlas_inventory(product_id VARCHAR(100) PRIMARY KEY,on_hand INTEGER NOT NULL DEFAULT 0,reserved INTEGER NOT NULL DEFAULT 0,reorder_level INTEGER NOT NULL DEFAULT 0,confirmed INTEGER NOT NULL DEFAULT 0,revision INTEGER NOT NULL DEFAULT 0,updated_at VARCHAR(30) NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS wenlas_stock_movements(id VARCHAR(100) PRIMARY KEY,product_id VARCHAR(100) NOT NULL,kind VARCHAR(20) NOT NULL,quantity INTEGER NOT NULL,before_stock INTEGER NOT NULL,after_stock INTEGER NOT NULL,before_threshold INTEGER NOT NULL,after_threshold INTEGER NOT NULL,reason VARCHAR(500) NOT NULL,actor_email VARCHAR(254) NOT NULL,request_hash VARCHAR(64) NOT NULL,created_at VARCHAR(30) NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS wenlas_inventory_users(id VARCHAR(36) PRIMARY KEY,email VARCHAR(254) NOT NULL UNIQUE,password_hash VARCHAR(512) NOT NULL,role VARCHAR(20) NOT NULL,disabled INTEGER NOT NULL DEFAULT 0,created_at VARCHAR(30) NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS wenlas_inventory_invites(token_hash VARCHAR(64) PRIMARY KEY,email VARCHAR(254) NOT NULL,role VARCHAR(20) NOT NULL,expires_at VARCHAR(30) NOT NULL,accepted_at VARCHAR(30),created_by VARCHAR(36) NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS wenlas_inventory_sessions(token_hash VARCHAR(64) PRIMARY KEY,user_id VARCHAR(36) NOT NULL,expires_at VARCHAR(30) NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS wenlas_auth_attempts(attempt_key VARCHAR(64) PRIMARY KEY,attempts INTEGER NOT NULL,reset_at BIGINT NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS wenlas_inventory_bootstrap(id INTEGER PRIMARY KEY)`,
];

export function liveInventoryConfigured(){return Boolean(process.env.WENLAS_DB_NAME||process.env.WENLAS_DATABASE_URL||process.env.WENLAS_LOCAL_INVENTORY==='true');}

export async function createInventoryDatabase(options:{sqlitePath?:string;pool?:Pool}={}):Promise<InventoryDatabase>{
 let pool=options.pool;
 let sqlite:DatabaseSync|undefined;
 if(!pool&&!options.sqlitePath&&(process.env.WENLAS_DB_NAME||process.env.WENLAS_DATABASE_URL)){
  const uri=process.env.WENLAS_DATABASE_URL?new URL(process.env.WENLAS_DATABASE_URL):null;
  const database=uri?decodeURIComponent(uri.pathname.slice(1)):process.env.WENLAS_DB_NAME!;
  if(!/^[a-zA-Z0-9_]*wenlas[a-zA-Z0-9_]*$/i.test(database)||uri&&uri.protocol!=='mysql:')throw Error('Use a dedicated Wenlas MySQL database');
  pool=createPool({host:uri?.hostname||process.env.WENLAS_DB_HOST||'127.0.0.1',port:Number(uri?.port||process.env.WENLAS_DB_PORT||3306),user:uri?decodeURIComponent(uri.username):process.env.WENLAS_DB_USER,password:uri?decodeURIComponent(uri.password):process.env.WENLAS_DB_PASSWORD,database,connectionLimit:5,waitForConnections:true,queueLimit:30,connectTimeout:10000,...(process.env.WENLAS_DB_TLS==='true'?{ssl:{rejectUnauthorized:true}}:{})});
 }else if(!pool){
  if(!options.sqlitePath&&process.env.NODE_ENV==='production')throw Error('Wenlas inventory database is not configured');
  const file=options.sqlitePath||process.env.WENLAS_INVENTORY_SQLITE_PATH||'.data/wenlas-inventory.sqlite';
  if(file!==':memory:')mkdirSync(dirname(file),{recursive:true});
  sqlite=new DatabaseSync(file);sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
 }
 let tail:Promise<unknown>=Promise.resolve();
 const database:InventoryDatabase={
  async transaction<T>(work:(query:Query)=>Promise<T>){
   if(pool){const connection=await pool.getConnection();try{await connection.beginTransaction();const query:Query=async<T>(sql:string,values:SqlValue[]=[])=>{const [result]=await connection.execute(sql,values);return (Array.isArray(result)?result:[]) as T[];};const value=await work(query);await connection.commit();return value;}catch(error){await connection.rollback();throw error;}finally{connection.release();}}
   const operation=tail.then(async()=>{sqlite!.exec('BEGIN IMMEDIATE');try{const query:Query=async<T>(sql:string,values:SqlValue[]=[])=>{const statement=sqlite!.prepare(sql.replace(/ FOR UPDATE\b/gi,''));if(/^\s*SELECT\b/i.test(sql))return statement.all(...values) as T[];statement.run(...values);return [];};const value=await work(query);sqlite!.exec('COMMIT');return value;}catch(error){sqlite!.exec('ROLLBACK');throw error;}});
   tail=operation.catch(()=>{});return operation;
  },
  async close(){await tail;if(pool)await pool.end();else sqlite?.close();},
 };
 // DDL runs outside MySQL transactions, which implicitly commit schema changes.
 for(const sql of tables){if(pool)await pool.query(sql+' ENGINE=InnoDB');else sqlite!.exec(sql);}
 await database.transaction(async query=>{
  const insert=pool?'INSERT IGNORE':'INSERT OR IGNORE';
  await query(insert+' INTO wenlas_inventory_bootstrap(id) VALUES(1)');
  const existing=await query<{count:number}>('SELECT COUNT(*) AS count FROM wenlas_inventory');
  if(Number(existing[0].count)<wenlasProducts.length)for(const p of wenlasProducts)await query(insert+' INTO wenlas_inventory(product_id,updated_at) VALUES(?,?)',[p.id,new Date().toISOString()]);
 });
 return database;
}

let instance:Promise<InventoryDatabase>|undefined;
export function inventoryDatabase(){if(!instance)instance=createInventoryDatabase().catch(error=>{instance=undefined;throw error;});return instance;}

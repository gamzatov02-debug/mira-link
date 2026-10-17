/** Node-only durable journal. Use a persistent volume, never an ephemeral filesystem.
 * Cloudflare deployments need an equivalent D1/Durable Object implementation.
 */
import {DatabaseSync} from 'node:sqlite';
import {EnergoError,mergeEnergoSession,sessionSchema,type EnergoJournal,type EnergoSession,type Operation} from './energo.server';
type Row={operation_key:string;guest:string;station:string;session_json:string|null};
export class SqliteEnergoJournal implements EnergoJournal{
 private readonly db:DatabaseSync;
 constructor(filename:string){
  if(typeof window!=='undefined')throw new EnergoError('SERVER_ONLY');
  this.db=new DatabaseSync(filename);
  this.db.exec(`PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;
   CREATE TABLE IF NOT EXISTS energo_operations (
    operation_key TEXT PRIMARY KEY, guest TEXT NOT NULL, station TEXT NOT NULL,
    session_id INTEGER UNIQUE, session_json TEXT, unfinished INTEGER NOT NULL DEFAULT 1
   );
   CREATE UNIQUE INDEX IF NOT EXISTS energo_one_unfinished_per_guest ON energo_operations(guest) WHERE unfinished=1;`);
 }
 close(){this.db.close()}
 private decode(row:Row):Operation{
  return {key:row.operation_key,guest:row.guest,station:row.station,session:row.session_json?sessionSchema.parse(JSON.parse(row.session_json)):undefined};
 }
 private transaction<T>(run:()=>T):T{
  this.db.exec('BEGIN IMMEDIATE');
  try{const result=run();this.db.exec('COMMIT');return result}catch(error){this.db.exec('ROLLBACK');throw error}
 }
 async claim(operation:Operation){return this.transaction(()=>{
  const row=this.db.prepare('SELECT * FROM energo_operations WHERE operation_key=?').get(operation.key) as Row|undefined;
  if(row){
   const existing=this.decode(row);
   if(existing.guest!==operation.guest||existing.station!==operation.station)throw new EnergoError('IDEMPOTENCY_CONFLICT');
   return {created:false,operation:existing};
  }
  if(this.db.prepare('SELECT 1 FROM energo_operations WHERE guest=? AND unfinished=1').get(operation.guest))throw new EnergoError('GUEST_RENTAL_UNRESOLVED');
  this.db.prepare('INSERT INTO energo_operations(operation_key,guest,station) VALUES(?,?,?)').run(operation.key,operation.guest,operation.station);
  return {created:true,operation:{...operation,session:undefined}};
 })}
 async save(key:string,incoming:EnergoSession){return this.transaction(()=>{
  const session=sessionSchema.parse(incoming);
  const row=this.db.prepare('SELECT * FROM energo_operations WHERE operation_key=?').get(key) as Row|undefined;
  if(!row)throw new EnergoError('UNKNOWN_OPERATION');
  const operation=this.decode(row);
  if(operation.station!==session.startStationId)throw new EnergoError('STATION_MISMATCH');
  const next=mergeEnergoSession(operation.session,session);
  this.db.prepare('UPDATE energo_operations SET session_id=?,session_json=?,unfinished=? WHERE operation_key=?')
   .run(next.sessionId,JSON.stringify(next),next.status==='Closed'?0:1,key);
  return next;
 })}
 async findSession(id:number){
  const row=this.db.prepare('SELECT * FROM energo_operations WHERE session_id=?').get(id) as Row|undefined;
  return row?this.decode(row):undefined;
 }
}

'use client';
import {dispatch,getState} from './store';
import type {ExecutionStatus,OperationalActorContext,Product} from './domain/model';
const pause=()=>new Promise(r=>setTimeout(r,getState().simulator.delay));
export interface POSAdapter{syncMenu():Promise<Product[]>;submitOrder(orderId:string,actor?:OperationalActorContext):Promise<void>;getOrderStatus(orderId:string):Promise<ExecutionStatus|undefined>;confirmCashPayment(paymentId:string,actor?:OperationalActorContext):Promise<void>}
export class DemoPOSAdapter implements POSAdapter{async syncMenu(){await pause();return getState().products}async submitOrder(orderId:string,actor?:OperationalActorContext){await pause();await dispatch({type:'posStatus',orderId,status:getState().simulator.posError?'error':'accepted',actor})}async getOrderStatus(id:string){return getState().orders.find(o=>o.id===id)?.executionStatus}async confirmCashPayment(id:string,actor?:OperationalActorContext){await pause();await dispatch({type:'confirmPayment',id,source:'pos',actor})}}
export interface PaymentAdapter{confirm(id:string,success:boolean):Promise<void>}
export class DemoPaymentAdapter implements PaymentAdapter{async confirm(id:string,success=true){await pause();await dispatch({type:success?'confirmPayment':'failPayment',id,source:'payment'})}}
export interface TaxiAdapter{request(destination:string):Promise<string>}
export class DemoTaxiAdapter implements TaxiAdapter{async request(destination:string){await pause();return `Демо: поездка до «${destination}» рассчитана. Машина не вызвана.`}}
export interface PowerbankAdapter{rent():Promise<string>}
export class DemoPowerbankAdapter implements PowerbankAdapter{async rent(){await pause();return 'Демо EnerGO: станция у входа, слот №3. Реальная аренда не запущена.'}}

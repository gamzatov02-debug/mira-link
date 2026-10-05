'use client';
import {useRef,useState} from 'react';
import {useDomain,dispatch} from '@/lib/store';
import type {CartItem,Product} from '@/lib/domain/model';
import {formatMoney} from '@/lib/domain/selectors';
import {ProductImage,ProductInfo} from './mira-domain-ui';
import {MiraButton as Button,MiraCard as Card,MiraInput as Input,MiraSelect as Select,MiraModal as Modal,MiraSearch,MiraToast,MiraEmptyState} from './mira';

export function StaffMenu(){
 const s=useDomain();
 const [mode,setMode]=useState<'closed'|'catalog'|'order'>('closed');
 const [tableId,setTableId]=useState(12),[guestId,setGuestId]=useState(''),[guestName,setGuestName]=useState('');
 const [search,setSearch]=useState(''),[product,setProduct]=useState<Product|null>(null);
 const [mods,setMods]=useState<string[]>([]),[quantity,setQuantity]=useState(1),[comment,setComment]=useState('');
 const [draft,setDraft]=useState<CartItem[]>([]),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState(false);
 const requestKey=useRef(''),submitting=useRef(false);
 const active=s.sessions.find(x=>x.tableId===tableId&&!x.closed);
 const currentProduct=s.products.find(p=>p.id===product?.id);
 const products=s.products.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase()));
 const total=draft.reduce((sum,item)=>{const p=s.products.find(p=>p.id===item.productId);return sum+(p?p.price+p.modifiers.filter(m=>item.modifierIds.includes(m.id)).reduce((n,m)=>n+m.price,0):0)*item.quantity},0);
 function pick(p:Product){setProduct(p);setMods([]);setQuantity(1);setComment('')}
 async function submit(){
  if(submitting.current)return;submitting.current=true;setBusy(true);setMessage('');
  requestKey.current ||= crypto.randomUUID();
  try{const result=await dispatch({type:'legacyDemoStaffSubmitOrder',source:'legacy-demo',waiterId:'w1',tableId,expectedSessionId:active?.id??null,guestId:guestId||undefined,guestName,items:draft,key:requestKey.current});setGuestId(result.guestId);setDraft([]);setGuestName('');setError(false);setMessage('Заказ оформлен и доступен гостю и администратору. Подтвердите передачу в iiko в списке заказов.');requestKey.current=''}
  catch(e){setError(true);setMessage(e instanceof Error?e.message:'Не удалось оформить заказ');requestKey.current=''}
  finally{setBusy(false);submitting.current=false}
 }
 return <section className="staff-menu" aria-label="Меню и заказ официанта">
  <div className="actions"><Button disabled={busy} onClick={()=>setMode('order')}>Оформить заказ за гостя</Button><Button className="outline" disabled={busy} onClick={()=>setMode('catalog')}>Меню для показа гостю</Button></div>
  <MiraToast kind={error?'error':'success'}>{message}</MiraToast>
  {mode!=='closed'&&<Card className="staff-menu-content"><div className="row"><h3>{mode==='order'?'Заказ за гостя':'Меню ресторана'}</h3><Button className="outline small" onClick={()=>setMode('closed')}>Свернуть меню</Button></div>
   {mode==='order'&&<fieldset disabled={busy} className="order-target"><Select label="Стол для заказа" value={tableId} onChange={e=>{setTableId(Number(e.target.value));setGuestId('')}}>{s.tables.filter(t=>t.waiterId==='w1').map(t=><option key={t.id} value={t.id}>Стол {t.id}</option>)}</Select>
    <Select label="Гость для заказа" value={guestId} onChange={e=>setGuestId(e.target.value)}><option value="">Новый гость без приложения</option>{s.guests.filter(g=>g.sessionId===active?.id).map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</Select>
    {!guestId&&<Input label="Имя или обозначение гостя" placeholder="Например, гость у окна" maxLength={60} value={guestName} onChange={e=>setGuestName(e.target.value)}/>}
    <p>{active?'Заказ попадёт в текущее посещение выбранного стола.':'Посещение откроется при оформлении заказа.'}</p>
   </fieldset>}
   <MiraSearch label="Поиск в меню сотрудника" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Название блюда или категория"/>
   <p className="catalog-note">Фото — примеры подачи. Состав демонстрационный; для реального обслуживания сверяйте его с кухней.</p>
   {!products.length&&<MiraEmptyState>Ничего не найдено.</MiraEmptyState>}
   <div className="staff-product-grid">{products.map(p=><article className="staff-product" key={p.id}><ProductImage product={p}/><h4>{p.name}</h4><small>{p.weight} · {formatMoney(p.price)}</small>{p.stopped&&<span className="badge">В стоп-листе</span>}<Button className="outline small" disabled={busy} onClick={()=>pick(p)}>Фото и состав</Button></article>)}</div>
   {mode==='order'&&<section className="staff-draft"><h3>Заказ · стол {tableId}</h3>{!draft.length?<MiraEmptyState>Выберите блюдо, дополнения и количество.</MiraEmptyState>:draft.map((item,index)=><div className="line" key={index}><span>{s.products.find(p=>p.id===item.productId)?.name} × {item.quantity}<small className="block">{item.comment}</small></span><Button className="outline small" disabled={busy} onClick={()=>setDraft(draft.filter((_,i)=>i!==index))}>Убрать</Button></div>)}<div className="line"><span>Итого</span><strong>{formatMoney(total)}</strong></div><Button loading={busy} disabled={!draft.length||!!guestId&&!s.guests.some(g=>g.id===guestId&&g.sessionId===active?.id)} onClick={()=>void submit()}>Оформить заказ официантом</Button></section>}
  </Card>}
  <Modal title={currentProduct?.name??'Блюдо'} description="Меню MIRA Restaurant" open={!!currentProduct} onClose={()=>setProduct(null)}>{currentProduct&&<><ProductImage product={currentProduct} className="dish-detail-image"/><ProductInfo product={currentProduct}/><p>{formatMoney(currentProduct.price)} · {currentProduct.weight}</p>{mode==='order'&&<>{currentProduct.modifiers.map(m=><label className="check-row" key={m.id}><input type={m.required?'radio':'checkbox'} name={`staff-${m.group}`} checked={mods.includes(m.id)} onChange={e=>setMods(m.required?[...mods.filter(id=>!currentProduct.modifiers.some(x=>x.id===id&&x.group===m.group)),m.id]:e.target.checked?[...mods,m.id]:mods.filter(id=>id!==m.id))}/>{m.name} {m.required?'· обязательно':''} · {formatMoney(m.price)}</label>)}<Input label="Количество порций" type="number" min={1} max={99} value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/><Input label="Пожелания к блюду" value={comment} onChange={e=>setComment(e.target.value)}/><Button disabled={busy||currentProduct.stopped||!Number.isInteger(quantity)||quantity<1||quantity>99||currentProduct.modifiers.some(m=>m.required&&!currentProduct.modifiers.some(x=>x.group===m.group&&mods.includes(x.id)))} onClick={()=>{setDraft([...draft,{productId:currentProduct.id,quantity,modifierIds:mods,comment}]);setProduct(null)}}>{currentProduct.stopped?'В стоп-листе':'Добавить в заказ официанта'}</Button></>}</>}</Modal>
 </section>;
}

'use client';
import {useSyncExternalStore} from 'react';
import type {State} from './domain/model';
import {seed} from './domain/seed';
import {execute,assertInvariants,type Command} from './domain/engine';
import {normalizeState} from './domain/migrations';
let state=seed();const initial=state;const listeners=new Set<()=>void>();let started=false;let channel:BroadcastChannel|undefined;
const KEY='mira-link-demo-v1';
const emit=()=>listeners.forEach(l=>l());
function read(){try{const raw=localStorage.getItem(KEY);if(raw){const next=normalizeState(JSON.parse(raw));assertInvariants(next);const reset=next.revision===0&&state.revision>0;state=next;if(reset)window.dispatchEvent(new Event('mira-reset'))}}catch{ /* Invalid saved demo never becomes domain truth. */ }}
function start(){if(started||typeof window==='undefined')return;started=true;read();if('BroadcastChannel' in window){channel=new BroadcastChannel(KEY);channel.onmessage=()=>{read();emit()}}window.addEventListener('storage',e=>{if(e.key===KEY){read();emit()}});}
export const getState=()=>{start();return state};
export async function dispatch(c:Command){start();const run=()=>{read();const next=execute(state,c);localStorage.setItem(KEY,JSON.stringify(next.state));state=next.state;channel?.postMessage({revision:state.revision});emit();if(c.type==='reset')window.dispatchEvent(new Event('mira-reset'));return next.result};if(navigator.locks)return navigator.locks.request(KEY,run);throw new Error('Для безопасного демо нужен современный браузер с Web Locks');}
export function useDomain(){return useSyncExternalStore(cb=>{start();listeners.add(cb);queueMicrotask(cb);return()=>{listeners.delete(cb)}},()=>state,()=>initial)}

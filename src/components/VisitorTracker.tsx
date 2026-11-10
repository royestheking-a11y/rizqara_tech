import {useEffect,useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {readConsent} from '../utils/consent';
import {apiRequest} from '../utils/api';
export function VisitorTracker(){
 const {pathname}=useLocation();const last=useRef('');
 useEffect(()=>{
  const record=()=>{
   if(!readConsent().analytics||pathname.startsWith('/admin')||last.current===pathname)return;
   try{
    let visitor=localStorage.getItem('rizqara_visitor_id');if(!visitor){visitor=crypto.randomUUID();localStorage.setItem('rizqara_visitor_id',visitor);}
    last.current=pathname;
    void apiRequest('analytics/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({eventId:crypto.randomUUID(),visitor,path:pathname,consent:true})}).catch(()=>{if(last.current===pathname)last.current='';});
   }catch{/* Tracking must never interrupt browsing. */}
  };
  const timer=setTimeout(record,250);window.addEventListener('rizqara-consent-change',record);
  return()=>{clearTimeout(timer);window.removeEventListener('rizqara-consent-change',record);};
 },[pathname]);return null;
}

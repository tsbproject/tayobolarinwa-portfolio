"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container:HTMLElement,options:{
        sitekey:string;action:string;
        callback:(token:string)=>void;
        "expired-callback":()=>void;
        "error-callback":()=>void;
      })=>string;
      remove:(widgetId:string)=>void;
      reset:(widgetId:string)=>void;
    };
  }
}
export default function SurveyTurnstile({onToken}: {onToken:(token:string)=>void}) {
  const slot=useRef<HTMLDivElement>(null);
  const widget=useRef<string|null>(null);
  const callback=useRef(onToken);
  useEffect(()=>{callback.current=onToken},[onToken]);
  useEffect(()=>{
    const sitekey=process.env.NEXT_PUBLIC_SOSTAIN_TURNSTILE_SITE_KEY;
    if(!sitekey || !slot.current) return;
    let cancelled=false;
    const mount=()=>{
      if(cancelled || !slot.current || widget.current || !window.turnstile) return;
      widget.current=window.turnstile.render(slot.current,{
        sitekey,action:"sostain-survey",
        callback:token=>callback.current(token),
        "expired-callback":()=>callback.current(""),
        "error-callback":()=>callback.current(""),
      });
    };
    const script=document.createElement("script");
    script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async=true;
    script.onload=mount;
    script.onerror=()=>callback.current("");
    document.head.appendChild(script);
    mount();
    return ()=>{
      cancelled=true;
      if(widget.current && window.turnstile)window.turnstile.remove(widget.current);
      widget.current=null;
      script.remove();
    };
  },[]);
  return <div className="min-h-16" ref={slot} aria-label="Security verification"/>;
}

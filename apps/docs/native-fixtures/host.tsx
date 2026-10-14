import { Component, useEffect, type ReactNode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from '@structured-growth/sg-ui/theme';
import { SGTranslationProvider, formatIcuMessage } from '@structured-growth/sg-ui/i18n';
import { tokens } from '@structured-growth/sg-ui/tokens';
import '@structured-growth/sg-ui/styles.css';
import registry from './registry.json';
import type { FixtureContext, FixtureGlobals, FixtureDecorator } from './types';
import type { Meta, StoryObj } from './types';

declare global {interface Window {__SGUI_FIXTURE__?:{id:string;status:'loading'|'success'|'error';autoplay:boolean;hasPlay:boolean;error?:string};}}
const modules=import.meta.glob('./scenarios/**/*.fixture.{tsx,ts}');
const query=new URLSearchParams(location.search);
const id=query.get('id')??'';
const autoplay=query.get('embed')!=='true';
const entry=registry.entries[id as keyof typeof registry.entries];
const globals:FixtureGlobals={theme:'light',density:'comfortable',locale:'en-US',direction:'auto'};
for(const pair of (query.get('globals')??'').split(';')) {
 const [key,value]=pair.split(':');
 if(key==='theme'&&['light','dark','system'].includes(value))globals.theme=value as FixtureGlobals['theme'];
 if(key==='density'&&['compact','comfortable'].includes(value))globals.density=value as FixtureGlobals['density'];
 if(key==='locale'&&value)globals.locale=value;
 if(key==='direction'&&['auto','ltr','rtl'].includes(value))globals.direction=value as FixtureGlobals['direction'];
}
function parseArgs(raw:string,defaults:Record<string,unknown>){
 const args={...defaults};
 for(const pair of raw.split(';')) {
  const colon=pair.indexOf(':');if(colon<0)continue;const key=pair.slice(0,colon),value=pair.slice(colon+1);
  if(value==='!undefined')args[key]=undefined;else if(value==='!null')args[key]=null;
  else if(['true','false','!true','!false'].includes(value))args[key]=value==='true'||value==='!true';
  else if(/^-?\d+(\.\d+)?$/.test(value))args[key]=Number(value);else args[key]=value;
 }
 return args;
}
class FixtureBoundary extends Component<{children:ReactNode},{error:string|null}> {
 state={error:null as string|null};
 static getDerivedStateFromError(error:Error){return {error:error.message};}
 componentDidCatch(error:Error){window.__SGUI_FIXTURE__={id,status:'error',autoplay,hasPlay:false,error:error.message};}
 render(){return this.state.error?<pre role="alert">{this.state.error}</pre>:this.props.children;}
}
function Completion({scenario,context}:{scenario:StoryObj;context:FixtureContext}) {
 useEffect(()=>{
  let cancelled=false;
  const frame=requestAnimationFrame(()=>{
   Promise.resolve().then(()=>autoplay&&scenario.play?scenario.play(context):undefined).then(()=>{
    if(!cancelled&&window.__SGUI_FIXTURE__?.status!=='error')window.__SGUI_FIXTURE__={id,status:'success',autoplay,hasPlay:!!scenario.play};
   },error=>{if(!cancelled){window.__SGUI_FIXTURE__={id,status:'error',autoplay,hasPlay:!!scenario.play,error:String(error)};console.error(error);}});
  });return ()=>{cancelled=true;cancelAnimationFrame(frame);};
 },[scenario,context]);return null;
}
async function start(){
 if(!entry)throw new Error(`Unknown native fixture: ${id}`);
 const load=modules[entry.module];if(!load)throw new Error(`Missing native fixture module: ${entry.module}`);
 const loaded=await load() as Record<string,unknown>;
 const meta=loaded.default as Meta<ComponentType<Record<string,unknown>>>;
 const scenario=loaded[entry.exportName] as StoryObj;
 const queryOverrides={...globals};Object.assign(globals,scenario.globals??{});for(const pair of (query.get('globals')??'').split(';')){const key=pair.split(':')[0] as keyof FixtureGlobals;if(key in queryOverrides)Object.assign(globals,{[key]:queryOverrides[key]});}
 const args=parseArgs(query.get('args')??'',{...meta.args,...scenario.args});
 const canvasElement=document.getElementById('sgui-fixture-root')!;
 const context:FixtureContext={id,globals,args,canvasElement};
 const Render=()=>scenario.render?scenario.render(args,context):meta.render?meta.render(args,context):meta.component?<meta.component {...args}/>:null;
 let Fixture:ComponentType=Render;
 for(const decorate of [...(scenario.decorators??[]),...(meta.decorators??[])] as FixtureDecorator[]){const Previous:ComponentType=Fixture;Fixture=():ReactNode=>decorate(Previous,context);}
 window.__SGUI_FIXTURE__={id,status:'loading',autoplay,hasPlay:!!scenario.play};
 createRoot(canvasElement).render(<FixtureBoundary><SGTranslationProvider value={{locale:globals.locale,t:(_key,options)=>formatIcuMessage(options.defaultMessage,globals.locale,options.values),useNamespace:()=>{}}}><Provider theme={globals.theme} density={globals.density} dir={globals.direction==='auto'?undefined:globals.direction} style={{background:tokens.surface,padding:tokens.space4,minHeight:'100vh',boxSizing:'border-box'}}><Fixture/><Completion scenario={scenario} context={context}/></Provider></SGTranslationProvider></FixtureBoundary>);
}
start().catch(error=>{window.__SGUI_FIXTURE__={id,status:'error',autoplay,hasPlay:false,error:String(error)};document.getElementById('sgui-fixture-root')!.textContent=String(error);console.error(error);});

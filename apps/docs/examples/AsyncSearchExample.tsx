'use client';
import {useEffect,useState} from 'react';
import {AsyncMultiSelect,type MultiSelectOption} from '@structured-growth/sg-ui/experimental';
import {Example} from '../components/Example';
import {exampleSource} from './source';
const records=[{id:'design',label:'Design systems'},{id:'engineering',label:'Engineering'},{id:'research',label:'Research'}];
/** A bounded local stand-in for a host search endpoint. Abort releases the timer. */
function searchRecords(query:string,signal:AbortSignal,fail:boolean):Promise<MultiSelectOption[]> {
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{if(fail)reject(new Error('Sample request failed. Retry to search again.'));else resolve(records.filter(record=>record.label.toLowerCase().includes(query.toLowerCase())));},350);
    signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));},{once:true});
  });
}
export function AsyncSearchExample() {
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<MultiSelectOption[]>([]);
  const [options,setOptions]=useState<MultiSelectOption[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string>();
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();let current=true;
    setLoading(true);setError(undefined);
    searchRecords(query,controller.signal,query.toLowerCase()==='fail'&&retry===0).then(results=>{if(current)setOptions(results);}).catch(reason=>{if(current){setOptions([]);setError(reason instanceof Error?reason.message:'Search failed.');}}).finally(()=>{if(current)setLoading(false);});
    return ()=>{current=false;controller.abort();};
  },[query,retry]);
  const state=`  const records=${JSON.stringify(records)};
  function searchRecords(query:string,signal:AbortSignal,fail:boolean):Promise<MultiSelectOption[]> {
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{if(fail)reject(new Error('Sample request failed. Retry to search again.'));else resolve(records.filter(record=>record.label.toLowerCase().includes(query.toLowerCase())));},350);
      signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));},{once:true});
    });
  }
  const [query,setQuery]=useState(${JSON.stringify(query)});
  const [selected,setSelected]=useState<MultiSelectOption[]>(${JSON.stringify(selected)});
  const [options,setOptions]=useState<MultiSelectOption[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string>();
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();let current=true;
    setLoading(true);setError(undefined);
    searchRecords(query,controller.signal,query.toLowerCase()==='fail'&&retry===0).then(results=>{if(current)setOptions(results);}).catch(reason=>{if(current){setOptions([]);setError(reason instanceof Error?reason.message:'Search failed.');}}).finally(()=>{if(current)setLoading(false);});
    return ()=>{current=false;controller.abort();};
  },[query,retry]);`;
  const body='<AsyncMultiSelect label="Search course topics" description="Type fail for a recoverable request error, then Retry. Change the query to find topics." query={query} onQueryChange={next=>{setRetry(0);setQuery(next);}} options={options} value={selected} onValueChange={setSelected} loading={loading} errorMessage={error} onRetry={()=>setRetry(value=>value+1)} />';
  return <Example title="Host-owned asynchronous search" description="A local 350ms adapter models pending results and failure/retry without an endpoint. Query changes and unmount abort the previous request; a freshness guard rejects late responses even if a real adapter ignores cancellation. Selected records persist independently of search results." source={exampleSource({name:'AsyncTopicSearch',imports:["import {useEffect} from 'react';","import {AsyncMultiSelect,type MultiSelectOption} from '@structured-growth/sg-ui/experimental';"],state,body})}>
    <AsyncMultiSelect label="Search course topics" description="Type fail for a recoverable request error, then Retry. Change the query to find topics." query={query} onQueryChange={next=>{setRetry(0);setQuery(next);}} options={options} value={selected} onValueChange={setSelected} loading={loading} errorMessage={error} onRetry={()=>setRetry(value=>value+1)}/>
  </Example>;
}

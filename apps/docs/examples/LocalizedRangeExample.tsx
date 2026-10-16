'use client';
import {useState} from 'react';
import {DateRangeSelector,type DateRange} from '@structured-growth/sg-ui/experimental';
import {Provider} from '@structured-growth/sg-ui/theme';
import {SGTranslationProvider,formatIcuMessage} from '@structured-growth/sg-ui/i18n';
import {Example} from '../components/Example';
import {exampleSource} from './source';
export function LocalizedRangeExample({locale}:{locale:'de-DE'|'ar-EG'}) {
  const [value,setValue]=useState<DateRange|null>({start:'2026-10-12',end:'2026-10-16'});
  const body=`<SGTranslationProvider value={{locale:${JSON.stringify(locale)},t:(_key,options)=>formatIcuMessage(options.defaultMessage,${JSON.stringify(locale)},options.values),useNamespace:()=>{}}}>
  <Provider>
    <DateRangeSelector label="Reporting dates" value={value} onValueChange={setValue} defaultFocusedDate="2026-10-12" months={1} name="reporting" />
  </Provider>
</SGTranslationProvider>`;
  return <Example title={`${locale} civil calendar`} description="Both locale examples start with the same ISO civil range, October 12–16, 2026. Locale controls calendar formatting and direction; it does not shift those dates. This host reports in America/Chicago; converting a local time to an instant is a separate host decision. The sample adapter retains English fallback UI messages; production hosts supply their translations." source={exampleSource({name:locale==='de-DE'?'GermanCivilRange':'ArabicCivilRange',imports:["import {DateRangeSelector,type DateRange} from '@structured-growth/sg-ui/experimental';","import {SGTranslationProvider,formatIcuMessage} from '@structured-growth/sg-ui/i18n';"],state:`  const [value,setValue]=useState<DateRange|null>(${JSON.stringify(value)});`,body})}>
    <SGTranslationProvider value={{locale,t:(_key,options)=>formatIcuMessage(options.defaultMessage,locale,options.values),useNamespace:()=>{}}}><Provider><DateRangeSelector label="Reporting dates" value={value} onValueChange={setValue} defaultFocusedDate="2026-10-12" months={1} name="reporting"/></Provider></SGTranslationProvider>
  </Example>;
}

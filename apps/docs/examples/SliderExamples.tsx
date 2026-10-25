'use client';
import {useState} from 'react';
import {SGTranslationProvider,formatIcuMessage} from '@structured-growth/sg-ui';
import {Provider} from '@structured-growth/sg-ui/theme';
import {Slider, Stack, Select, Switch, TextField, Button, Typography, type SliderMark,type SliderProps} from '@structured-growth/sg-ui/primitives';
import type {Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';
const imports=["import {Slider} from '@structured-growth/sg-ui/primitives';"];
const options=(values:readonly string[])=>values.map(id=>({id,label:id}));
const scales={
  percent:{min:0,max:1,step:0.01,formatOptions:{style:'percent',maximumFractionDigits:0} as Intl.NumberFormatOptions},
  rating:{min:1,max:10,step:1},
  temperature:{min:-50,max:50,step:0.5},
  price:{min:0,max:100,step:0.01,formatOptions:{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2} as Intl.NumberFormatOptions},
};

export function SliderExamples(){
  return <Stack gap={4}>
    <SliderPlayground/>
    {(['horizontal','vertical'] as const).flatMap(orientation=>(['compact','comfortable'] as const).flatMap(density=>[false,true].map(range=>
      <SliderReference key={`${orientation}-${density}-${range}`} title={`${range?'Range':'Single'} · ${orientation} · ${density}`} orientation={orientation} density={density} initial={range?[25,75]:40}/>
    )))}
    <SliderReference title="Stepped survey scale" label="Confidence" min={1} max={5} step={1} initial={3} marks={[{value:1,label:'Low'},{value:3,label:'Medium'},{value:5,label:'High'}]} description="One answer on a five-point scale. Marks explain the scale; step controls which values are available."/>
    <SliderReference title="Centered fractional scale" label="Exposure adjustment" min={-5} max={5} step={0.25} initial={1.5} fillOffset={0} marks={[{value:-5,label:'−5'},{value:0,label:'0'},{value:5,label:'+5'}]}/>
    <SliderReference title="Formatted price range" label="Budget" max={1000} step={10} initial={[200,700]} formatOptions={{style:'currency',currency:'USD',maximumFractionDigits:0}} thumbLabels={['Minimum budget','Maximum budget']}/>
    <SliderReference title="Dollars and cents" label="Amount" min={0} max={100} step={0.01} initial={12.5} formatOptions={{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}} description="Selectable values advance by one cent. Display and accessible values keep exactly two decimal places; callbacks remain raw numbers."/>
    <SliderReference title="Percentage with two decimal places" label="Allocation" min={0} max={1} step={0.0001} initial={0.255} formatOptions={{style:'percent',minimumFractionDigits:2,maximumFractionDigits:2}} description="0.255 is displayed as 25.50%. One percentage point is 0.01 in this fractional scale."/>
    <SliderReference title="Percentage on a 0–100 scale" label="Completion" min={0} max={100} step={0.01} initial={25.5} formatOptions={{style:'unit',unit:'percent',minimumFractionDigits:2,maximumFractionDigits:2}} description="Percentage-point values stay on a 0–100 scale: 25.5 displays as 25.50% without multiplying the numeric value."/>
    <SliderReference title="Multiple thresholds" label="Performance thresholds" initial={[20,50,80]} thumbLabels={['Lower threshold','Middle threshold','Upper threshold']}/>
    {(['before','after','between','none'] as const).map(fill=><SliderReference key={fill} title={`Fill · ${fill}`} fill={fill} initial={[20,50,80]} thumbLabels={['Lower threshold','Middle threshold','Upper threshold']} description="Before fills from the minimum to the first handle; after fills from the last handle to the maximum; between joins the outer handles; none leaves the rail unfilled."/>)}
    <SliderReference title="Tick marks without snapping" label="Choice 1" initial={23} increment={10} fill="none" description="Dots show ten-unit increments. The one-unit step still allows values between dots."/>
    <SliderReference title="Snap to tick increments" label="Choice 1" initial={20} increment={10} snapToIncrements fill="none" description="Pointer and keyboard selection snap to 0, 10, 20, through 100."/>
    <SliderReference title="Vertical tick lines" orientation="vertical" initial={[20,80]} increment={20} tickAppearance="line" snapToIncrements/>
    <SliderReference title="Disabled slider" disabled initial={40}/>
    <SliderReference title="Host validation" label="Target score" initial={35} invalid errorMessage="Choose a target of at least 50." description="The host owns this validation rule."/>
    <LocalizedSliderExample/>
    <PreciseSliderExample/>
    <SliderFormExample/>
  </Stack>;
}
function SliderPlayground(){
  const [value,setValue]=useState<number|number[]>(5);
  const [label,setLabel]=useState('Target');
  const [scale,setScale]=useState<keyof typeof scales|'custom'>('rating');
  const [config,setConfig]=useState({min:1,max:10,step:1});
  const [draft,setDraft]=useState({min:'1',max:'10',step:'1'});
  const [numberFormat,setNumberFormat]=useState<'decimal'|'percent'|'percentagePoints'|'currency'>('decimal');
  const [decimalPlaces,setDecimalPlaces]=useState(0);
  const [currency,setCurrency]=useState('USD');
  const [handleCount,setHandleCount]=useState(1);
  const [tickIncrement,setTickIncrement]=useState(1);
  const [incrementDraft,setIncrementDraft]=useState('1');
  const [showTicks,setShowTicks]=useState(false),[snapToIncrements,setSnapToIncrements]=useState(false);
  const [tickAppearance,setTickAppearance]=useState<'dot'|'line'>('dot');
  const [fill,setFill]=useState<NonNullable<SliderProps["fill"]>>("auto");
  const [orientation,setOrientation]=useState<'horizontal'|'vertical'>('horizontal');
  const [density,setDensity]=useState<Density>('comfortable');
  const [disabled,setDisabled]=useState(false),[invalid,setInvalid]=useState(false);
  const [showValue,setShowValue]=useState(true),[showBounds,setShowBounds]=useState(true),[showMarks,setShowMarks]=useState(false);
  const formatOptions:Intl.NumberFormatOptions={minimumFractionDigits:decimalPlaces,maximumFractionDigits:decimalPlaces,...(numberFormat==='currency'?{style:'currency',currency}:numberFormat==='percentagePoints'?{style:'unit',unit:'percent'}:{style:numberFormat})};
  const proposed={min:Number(draft.min),max:Number(draft.max),step:Number(draft.step)};
  const validBounds=!!draft.min.trim()&&!!draft.max.trim()&&Number.isFinite(proposed.min)&&Number.isFinite(proposed.max)&&Number.isFinite(proposed.max-proposed.min)&&proposed.min<proposed.max;
  const validStep=!!draft.step.trim()&&Number.isFinite(proposed.step)&&proposed.step>0&&proposed.step<=proposed.max-proposed.min;
  const marks=showMarks?[{value:config.min,label:String(config.min)},{value:(config.min+config.max)/2},{value:config.max,label:String(config.max)}]:undefined;
  const valuesForCount=(count:number,config:{min:number;max:number;step:number})=>{
    const {min,max,step}=config;
    const availableSteps=(max-min)/step;
    const lastStep=Math.floor(availableSteps+Number.EPSILON*Math.max(1,availableSteps)*4);
    const at=(fraction:number)=>Math.max(min,Math.min(max,Number((min+Math.min(lastStep,Math.round(availableSteps*fraction))*step).toPrecision(15))));
    return count===1?at(.5):Array.from({length:count},(_,index)=>at((index+1)/(count+1)));
  };
  const updateScale=(next:keyof typeof scales|'custom')=>{
    setScale(next);if(next==='custom')return;
    const {min,max,step}=scales[next],config={min,max,step};
    const tick=next==='rating'?1:(max-min)/10;setTickIncrement(tick);setIncrementDraft(String(tick));
    setConfig(config);setDraft({min:String(min),max:String(max),step:String(step)});setValue(valuesForCount(handleCount,{...config,step:snapToIncrements?tick:step}));
    setNumberFormat(next==='percent'?'percent':next==='price'?'currency':'decimal');setDecimalPlaces(next==='price'?2:next==='temperature'?1:0);setCurrency('USD');
  };
  const applyBounds=()=>{
    if(!validBounds||!validStep)return;
    if(proposed.min===config.min&&proposed.max===config.max&&proposed.step===config.step)return;
    const tick=(proposed.max-proposed.min)/tickIncrement<1001&&tickIncrement<=proposed.max-proposed.min?tickIncrement:(proposed.max-proposed.min)/10;
    setTickIncrement(tick);setIncrementDraft(String(tick));
    setConfig(proposed);setScale('custom');setValue(valuesForCount(handleCount,{...proposed,step:snapToIncrements?tick:proposed.step}));
  };
  const updateHandles=(count:number)=>{setHandleCount(count);setValue(valuesForCount(count,{...config,step:snapToIncrements?tickIncrement:config.step}));};
  const proposedIncrement=Number(incrementDraft);
  const validIncrement=!!incrementDraft.trim()&&Number.isFinite(proposedIncrement)&&proposedIncrement>0&&(config.max-config.min)/proposedIncrement<1001;
  const applyIncrement=()=>{if(!validIncrement)return;setTickIncrement(proposedIncrement);if(snapToIncrements)setValue(valuesForCount(handleCount,{...config,step:proposedIncrement}));};
  const updateSnapping=(next:boolean)=>{setSnapToIncrements(next);setValue(valuesForCount(handleCount,{...config,step:next?tickIncrement:config.step}));};
  return <Example title="Prop playground" density={density} source={exampleSource({name:'AdjustableSlider',imports,
    state:`  const [value,setValue]=useState<number|number[]>(${JSON.stringify(value)});`,
    body:`<Slider label={${literal(label)}} value={value} onValueChange={setValue} min={${config.min}} max={${config.max}} step={${config.step}} orientation="${orientation}" increment={${tickIncrement}} showTicks={${showTicks}} snapToIncrements={${snapToIncrements}} tickAppearance="${tickAppearance}" fill="${fill}" density="${density}" disabled={${disabled}} invalid={${invalid}} ${invalid?'errorMessage="Review this value." ':''}showValue={${showValue}} showBounds={${showBounds}} marks={${JSON.stringify(marks??[])}} formatOptions={${JSON.stringify(formatOptions)}}/>`})}
    controls={<Stack gap={3}><Stack direction="row" wrap gap={3}>
      <TextField label="Label" value={label} onValueChange={setLabel}/>
      <Select label="Scale" options={options(['rating','percent','temperature','price','custom'])} value={scale} onValueChange={next=>updateScale(next as keyof typeof scales|'custom')}/>
      <Select label="Handles" options={options(['1','2','3','4','5'])} value={String(handleCount)} onValueChange={next=>updateHandles(Number(next))}/>
      <Select label="Fill" options={options(['auto','before','after','between','none'])} value={fill} onValueChange={next=>setFill(next as typeof fill)}/>
      <Select label="Orientation" options={options(['horizontal','vertical'])} value={orientation} onValueChange={next=>setOrientation(next as typeof orientation)}/>
      <Select label="Density" options={options(['compact','comfortable'])} value={density} onValueChange={next=>setDensity(next as Density)}/>
    </Stack><Stack direction="row" wrap gap={3}>
      <TextField label="Lower bound" inputMode="decimal" value={draft.min} onValueChange={min=>setDraft(current=>({...current,min}))} onBlur={applyBounds} invalid={!validBounds} errorMessage="Enter finite bounds with lower less than upper."/>
      <TextField label="Upper bound" inputMode="decimal" value={draft.max} onValueChange={max=>setDraft(current=>({...current,max}))} onBlur={applyBounds} invalid={!validBounds} errorMessage="Enter finite bounds with lower less than upper."/>
      <TextField label="Step size" inputMode="decimal" value={draft.step} onValueChange={step=>setDraft(current=>({...current,step}))} onBlur={applyBounds} invalid={!validStep} errorMessage="Enter a positive step no larger than the range."/>
      <Select label="Number format" options={[{id:'decimal',label:'Number'},{id:'percent',label:'Percent (0–1)'},{id:'percentagePoints',label:'Percent (0–100)'},{id:'currency',label:'Currency'}]} value={numberFormat} onValueChange={next=>setNumberFormat(next as typeof numberFormat)}/>
      <Select label="Decimal places" options={options(['0','1','2','3','4','5','6'])} value={String(decimalPlaces)} onValueChange={next=>setDecimalPlaces(Number(next))}/>
      <Select label="Currency" disabled={numberFormat!=='currency'} options={options(['USD','EUR','GBP','CAD','JPY'])} value={currency} onValueChange={next=>setCurrency(next??'USD')}/>
    </Stack><Stack direction="row" wrap gap={3}>
      <TextField label="Tick increment" inputMode="decimal" value={incrementDraft} onValueChange={setIncrementDraft} onBlur={applyIncrement} invalid={!validIncrement} errorMessage="Use a positive increment producing at most 1001 ticks."/>
      <Select label="Tick appearance" options={options(['dot','line'])} value={tickAppearance} onValueChange={next=>setTickAppearance(next as typeof tickAppearance)}/>
      <Switch label="Show ticks" checked={showTicks} onCheckedChange={setShowTicks}/>
      <Switch label="Snap to increments" checked={snapToIncrements} onCheckedChange={updateSnapping}/>
    </Stack><Stack direction="row" wrap gap={3}>
      <Switch label="Show value" checked={showValue} onCheckedChange={setShowValue}/>
      <Switch label="Show bounds" checked={showBounds} onCheckedChange={setShowBounds}/><Switch label="Show marks" checked={showMarks} onCheckedChange={setShowMarks}/>
      <Switch label="Disabled" checked={disabled} onCheckedChange={setDisabled}/><Switch label="Invalid" checked={invalid} onCheckedChange={setInvalid}/>
    </Stack></Stack>}>
    <Slider label={label} value={value} onValueChange={setValue} {...config} formatOptions={formatOptions} orientation={orientation} increment={tickIncrement} showTicks={showTicks} snapToIncrements={snapToIncrements} tickAppearance={tickAppearance} fill={fill} density={density} disabled={disabled} invalid={invalid} errorMessage="Review this value." showValue={showValue} showBounds={showBounds} marks={marks}/>
  </Example>;
}
function SliderReference({title,label='Amount',initial=40,density='comfortable',orientation='horizontal',min=0,max=100,step=1,marks,increment,showTicks=true,snapToIncrements=false,tickAppearance='dot',fill="auto",fillOffset,formatOptions,thumbLabels,disabled,invalid,errorMessage,description}: {
  title:string;label?:string;initial?:number|number[];density?:Density;orientation?:'horizontal'|'vertical';min?:number;max?:number;step?:number;marks?:SliderMark[];increment?:number;showTicks?:boolean;snapToIncrements?:boolean;tickAppearance?:'dot'|'line';fill?:SliderProps["fill"];fillOffset?:number;formatOptions?:Intl.NumberFormatOptions;thumbLabels?:string[];disabled?:boolean;invalid?:boolean;errorMessage?:string;description?:string;
}){
  const [value,setValue]=useState<number|number[]>(initial);
  const attributes=`label={${literal(label)}} value={value} onValueChange={setValue} min={${min}} max={${max}} step={${step}} orientation="${orientation}" density="${density}" fill="${fill}" showBounds increment={${increment}} showTicks={${showTicks}} snapToIncrements={${snapToIncrements}} tickAppearance="${tickAppearance}" marks={${JSON.stringify(marks??[])}}${fillOffset!==undefined?` fillOffset={${fillOffset}}`:''}${formatOptions?` formatOptions={${JSON.stringify(formatOptions)}}`:''}${thumbLabels?` thumbLabels={${JSON.stringify(thumbLabels)}}`:''}${disabled?' disabled':''}${invalid?' invalid':''}${errorMessage?` errorMessage={${literal(errorMessage)}}`:''}${description?` description={${literal(description)}}`:''}`;
  return <Example title={title} density={density} source={exampleSource({name:'SliderExample',imports,state:`  const [value,setValue]=useState<number|number[]>(${JSON.stringify(value)});`,body:`<Slider ${attributes}/>`})}>
    <Slider label={label} value={value} onValueChange={setValue} density={density} orientation={orientation} min={min} max={max} step={step} showBounds increment={increment} showTicks={showTicks} snapToIncrements={snapToIncrements} tickAppearance={tickAppearance} marks={marks} fill={fill} fillOffset={fillOffset} formatOptions={formatOptions} thumbLabels={thumbLabels} disabled={disabled} invalid={invalid} errorMessage={errorMessage} description={description}/>
  </Example>;
}
function PreciseSliderExample(){
  const [value,setValue]=useState(40),[draft,setDraft]=useState('40');
  const change=(next:number)=>{setValue(next);setDraft(String(next));};
  const apply=()=>{const parsed=Number(draft);if(draft.trim()&&Number.isFinite(parsed))change(Math.min(100,Math.max(0,Math.round(parsed))));else setDraft(String(value));};
  return <Example title="Slider with precise text entry" description="The text field is a separate control sharing host state. Blur accepts a whole number from 0 to 100; invalid text restores the current value." source={exampleSource({name:'PreciseSlider',imports:["import {Slider,TextField,Stack} from '@structured-growth/sg-ui/primitives';"],
    state:`  const [value,setValue]=useState(${value});\n  const [draft,setDraft]=useState(${literal(draft)});\n  const change=(next:number)=>{setValue(next);setDraft(String(next));};\n  const apply=()=>{const parsed=Number(draft);if(draft.trim()&&Number.isFinite(parsed))change(Math.min(100,Math.max(0,Math.round(parsed))));else setDraft(String(value));};`,
    body:'<Stack gap={3}><Slider label="Opacity" value={value} onValueChange={change} showBounds/><TextField label="Exact opacity (0–100)" inputMode="decimal" value={draft} onValueChange={setDraft} onBlur={apply}/></Stack>'})}>
    <Stack gap={3}><Slider label="Opacity" value={value} onValueChange={change} showBounds/><TextField label="Exact opacity (0–100)" inputMode="decimal" value={draft} onValueChange={setDraft} onBlur={apply}/></Stack>
  </Example>;
}
function SliderFormExample(){
  const [result,setResult]=useState('');
  const body='<form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setResult(`Draft budget: ${data.get("budget[0]")}–${data.get("budget[1]")}`);}} onReset={()=>setResult("")}><Stack gap={3}><Slider label="Budget range" name="budget" defaultValue={[200,700]} min={0} max={1000} step={10} thumbLabels={["Minimum budget","Maximum budget"]} formatOptions={{style:"currency",currency:"USD",maximumFractionDigits:0}} showBounds/><Stack direction="row" gap={2}><Button type="submit">Review budget</Button><Button type="reset" variant="outlined">Reset</Button></Stack>{result&&<Typography role="status">{result}</Typography>}</Stack></form>';
  return <Example title="Native form and reset" description="Each handle submits a named numeric value. Reset restores the defaults; reviewing creates a local draft without persistence." source={exampleSource({name:'BudgetForm',imports:["import {Slider,Stack,Button,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  const [result,setResult]=useState(${literal(result)});`,body})}>
    <form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setResult(`Draft budget: ${data.get('budget[0]')}–${data.get('budget[1]')}`);}} onReset={()=>setResult('')}><Stack gap={3}>
      <Slider label="Budget range" name="budget" defaultValue={[200,700]} min={0} max={1000} step={10} thumbLabels={['Minimum budget','Maximum budget']} formatOptions={{style:'currency',currency:'USD',maximumFractionDigits:0}} showBounds/>
      <Stack direction="row" gap={2}><Button type="submit">Review budget</Button><Button type="reset" variant="outlined">Reset</Button></Stack>{result&&<Typography role="status">{result}</Typography>}
    </Stack></form>
  </Example>;
}

function LocalizedSliderExample(){
  const [value,setValue]=useState(40);
  const body='<SGTranslationProvider value={{locale:"ar-SA",t:(_key,options)=>formatIcuMessage(options.defaultMessage,"ar-SA",options.values),useNamespace:()=>{}}}><Provider><Slider label="المستوى" value={value} onValueChange={setValue} showBounds/></Provider></SGTranslationProvider>';
  return <Example title="Arabic locale and RTL" description="This example owns an explicit locale scope so pointer direction, value formatting and layout follow Arabic together." source={exampleSource({name:'ArabicSlider',imports:[...imports,"import {SGTranslationProvider,formatIcuMessage} from '@structured-growth/sg-ui';"],state:`  const [value,setValue]=useState(${value});`,body})}>
    <SGTranslationProvider value={{locale:'ar-SA',t:(_key,options)=>formatIcuMessage(options.defaultMessage,'ar-SA',options.values),useNamespace:()=>{}}}><Provider><Slider label="المستوى" value={value} onValueChange={setValue} showBounds/></Provider></SGTranslationProvider>
  </Example>;
}

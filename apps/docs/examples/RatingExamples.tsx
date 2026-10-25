'use client';
import {useState} from 'react';
import {Rating,Stack,Select,TextField,Switch,Button,Typography,type RatingOption,type RatingProps} from '@structured-growth/sg-ui/primitives';
import {SchoolIcon,StarIcon,HeartIcon} from '@structured-growth/sg-ui/icons';
import {Provider,type Density} from '@structured-growth/sg-ui/theme';
import {SGTranslationProvider,formatIcuMessage} from '@structured-growth/sg-ui';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';

type Preset='stars'|'numbers'|'labels'|'hearts'|'faces'|'clusters'|'pain'|'likert'|'thumbs';
const labels=['Very dissatisfied','Dissatisfied','Neutral','Satisfied','Very satisfied'];
const likertOptions:RatingOption[]=['Strongly disagree','Disagree','Neither agree nor disagree','Agree','Strongly agree'].map((label,index)=>({value:index+1,label}));
const faces=['😞','🙁','😐','🙂','😄'];
const labeledOptions:RatingOption[]=labels.map((label,index)=>({value:index+1,label}));
const faceOptions:RatingOption[]=labels.map((label,index)=>({value:index+1,label,icon:faces[index]}));
const painIcons=['🙂','😐','🙁','😣','😫','😭'];
const painMeanings=['No pain','Mild pain','Moderate pain','Strong pain','Severe pain','Extreme pain'];
const painOptions:RatingOption[]=Array.from({length:11},(_,value)=>({value,label:value%2===0?`${value} — ${painMeanings[value/2]}`:`${value} of 10 pain`,annotation:value%2===0?painIcons[value/2]:null}));
const clusterOptions:RatingOption[]=Array.from({length:5},(_,index)=>({value:index+1,label:`${index+1} learning ${index===0?'symbol':'symbols'}`,icon:<>{Array.from({length:index+1},(_,symbol)=><SchoolIcon key={symbol}/>)}</>}));
function presetConfig(preset:Preset):{props:Partial<RatingProps>;code:string;setup?:string;icons?:string}{
 if(preset==='likert')return {props:{variant:'labels',options:likertOptions},code:'variant="labels" options={options}',setup:`  const options=${JSON.stringify(likertOptions)};`};
 if(preset==='labels')return {props:{variant:'labels',options:labeledOptions},code:'variant="labels" options={options}',setup:`  const options=${JSON.stringify(labeledOptions)};`};
 if(preset==='thumbs')return {props:{variant:'icons',icon:'👍',emptyIcon:'-'},code:'variant="icons" icon="👍" emptyIcon="-"'};
 if(preset==='hearts')return {props:{variant:'icons',icon:<HeartIcon fill="currentColor"/>,emptyIcon:<HeartIcon/>},code:'variant="icons" icon={<HeartIcon fill="currentColor"/>} emptyIcon={<HeartIcon/>}',icons:'HeartIcon'};
 if(preset==='pain')return {props:{variant:'numbers',options:painOptions},code:'variant="numbers" options={options}',setup:`  const options=${JSON.stringify(painOptions)};`};
 if(preset==='faces')return {props:{variant:'icons',options:faceOptions},code:'variant="icons" options={options}',setup:`  const options=${JSON.stringify(faceOptions)};`};
 if(preset==='clusters')return {props:{variant:'icons',options:clusterOptions,optionLayout:'stacked'},code:'variant="icons" options={options} optionLayout="stacked"',setup:`  const options=[${clusterOptions.map((option,index)=>`{value:${option.value},label:${literal(option.label)},icon:<>${'<SchoolIcon/>'.repeat(index+1)}</>}`).join(',')}];`,icons:'SchoolIcon'};
 return {props:{variant:preset},code:`variant="${preset}"`};
}
const selectOptions=(values:readonly string[])=>values.map(id=>({id,label:id}));
const imports=["import {Rating} from '@structured-growth/sg-ui/primitives';"];
export function RatingExamples(){
 return <Stack gap={4}>
  <RatingPlayground/>
  <RatingReference title="Plain stars" preset="stars" appearance="plain" initial={3}/>
  <RatingReference title="Plain hearts" preset="hearts" appearance="plain" initial={3}/>
  <RatingReference title="Plain thumbs up from dashes" preset="thumbs" appearance="plain"/>
  <NumberedLikertExample/>
  <LikelihoodScaleExample/>
  <LikelihoodScaleExample layout="staggered"/>
  <LikelihoodScaleExample orientation="vertical"/>
  {(['horizontal','vertical'] as const).flatMap(orientation=>(['compact','comfortable'] as const).map(density=><RatingReference key={`${orientation}-${density}`} title={`Stars · ${orientation} · ${density}`} preset="stars" orientation={orientation} density={density}/>))}
  {(['horizontal','vertical'] as const).flatMap(orientation=>(['compact','comfortable'] as const).map(density=><RatingReference key={`staggered-${orientation}-${density}`} title={`Staggered pain scale · ${orientation} · ${density}`} preset="pain" orientation={orientation} density={density} layout="staggered" highlightMode="selected" highlightAppearance="background"/>))}
  {(['inline','staggered'] as const).flatMap(layout=>(['horizontal','vertical'] as const).flatMap(orientation=>(['compact','comfortable'] as const).map(density=><RatingReference key={`likert-${layout}-${orientation}-${density}`} title={`Likert · ${layout === 'staggered' ? 'staggered · ' : ''}${orientation} · ${density}`} preset="likert" orientation={orientation} density={density} layout={layout} highlightMode="selected" highlightAppearance="background" description="Choose how much you agree with the statement. Only the selected answer is highlighted."/>)))}
  <RatingReference title="Staggered numbered scale" preset="numbers" layout="staggered"/>
  <RatingReference title="Staggered labeled scale" preset="labels" layout="staggered"/>
  <RatingReference title="Numbered scale" preset="numbers" max={10} description="A ten-point scale, with one numeric form value and no selection by default."/>
  <RatingReference title="Labeled answers" preset="labels" description="The visible answer labels also provide each radio's accessible name."/>
  <RatingReference title="Thumbs up from dashes" preset="thumbs" highlightMode="cumulative" highlightAppearance="icon" description="Unanswered choices start as dashes. Hover previews thumbs up through that position; selecting keeps those icons, and leaving restores the selected rating."/>
  <RatingReference title="Repeated heart symbols" preset="hearts" description="A shared custom symbol repeats across the scale, with a separate empty symbol."/>
  <RatingReference title="Pain scale with distinct icons" preset="pain" highlightMode="selected" highlightAppearance="background" description="Illustrative host-defined 0–10 scale: icons label even values above the number buttons; all 0–10 numbers are selectable. Only the chosen level is highlighted."/>
  <RatingReference title="Different icons for each answer" preset="faces" highlightMode="selected" showOptionLabels description="Each answer has its own host-supplied icon and label. Only the selected answer is highlighted."/>
  <RatingReference title="Several icons in each choice" preset="clusters" highlightMode="selected" showOptionLabels description="One through five learning icons per answer. Each icon group still represents one numeric answer."/>
  <SharedVectorRating/>
  <RatingReference title="Background highlighting" preset="stars" highlightAppearance="background" initial={3}/>
  <RatingReference title="Icons and backgrounds" preset="stars" highlightAppearance="both" initial={3}/>
  <RatingReference title="Selected symbol only" preset="stars" highlightMode="selected" initial={3}/>
  <RatingReference title="Read-only rating" preset="stars" readOnly initial={4}/>
  <RatingReference title="Disabled rating" preset="numbers" disabled initial={3}/>
  <RatingReference title="Validation and guidance" preset="labels" invalid description="The host owns any additional rules."/>
  <RtlRatingExample/>
  <RatingFormExample/>
 </Stack>;
}
function RatingPlayground(){
 const [value,setValue]=useState<number|null>(null);
 const [preset,setPreset]=useState<Preset>('stars'),[label,setLabel]=useState('Session rating');
 const [max,setMax]=useState(5),[density,setDensity]=useState<Density>('comfortable');
 const [orientation,setOrientation]=useState<'horizontal'|'vertical'>('horizontal');
 const [appearance,setAppearance]=useState<'icon'|'background'|'both'>('icon');
 const [choiceShape,setChoiceShape]=useState<'rounded'|'circle'>('rounded');
 const [scaleAnchors,setScaleAnchors]=useState(false);
 const [frameAppearance,setFrameAppearance]=useState<'outlined'|'plain'>('outlined');
 const [buttonWidth,setButtonWidth]=useState<'equal'|'content'>('equal');
 const [layout,setLayout]=useState<'inline'|'staggered'>('inline');
 const [highlight,setHighlight]=useState<'cumulative'|'selected'>('cumulative');
 const [showLabels,setShowLabels]=useState(false),[clearable,setClearable]=useState(true);
 const [disabled,setDisabled]=useState(false),[readOnly,setReadOnly]=useState(false),[required,setRequired]=useState(false),[invalid,setInvalid]=useState(false);
 const config=presetConfig(preset),customOptions=!!config.props.options;
 const source=exampleSource({name:'SurveyRating',imports:[...imports,...(config.icons?[`import {${config.icons}} from '@structured-growth/sg-ui/icons';`]:[])],
  state:`${config.setup??''}\n  const [value,setValue]=useState<number|null>(${JSON.stringify(value)});`,
  body:`<Rating label={${literal(label)}} ${config.code} max={${max}} value={value} onValueChange={setValue} density="${density}" orientation="${orientation}" highlightMode="${highlight}" highlightAppearance="${appearance}" appearance="${frameAppearance}" choiceShape="${choiceShape}" ${scaleAnchors?'scaleLabels={{start:"Not at all likely",middle:"Neutral",end:"Extremely likely"}}':''} layout="${layout}" buttonWidth="${buttonWidth}" showOptionLabels={${showLabels}} clearable={${clearable}} disabled={${disabled}} readOnly={${readOnly}} required={${required}} invalid={${invalid}} description="Choose one answer. Nothing is selected until you respond." errorMessage="Choose a rating before continuing."/>`});
 return <Example title="Prop playground" density={density} source={source} controls={<Stack gap={3}>
  <Stack direction="row" wrap gap={3}>
   <TextField label="Question label" value={label} onValueChange={setLabel}/>
   <Select label="Presentation" options={selectOptions(['stars','numbers','labels','hearts','faces','clusters','pain','likert','thumbs'])} value={preset} onValueChange={next=>{setPreset(next as Preset);setValue(null);}}/>
   <Select label="Scale size" disabled={customOptions} options={selectOptions(['5','7','10'])} value={String(max)} onValueChange={next=>{setMax(Number(next));setValue(null);}}/>
   <Select label="Density" options={selectOptions(['compact','comfortable'])} value={density} onValueChange={next=>setDensity(next as Density)}/>
   <Select label="Orientation" options={selectOptions(['horizontal','vertical'])} value={orientation} onValueChange={next=>setOrientation(next as typeof orientation)}/>
   <Select label="Choice shape" options={selectOptions(['rounded','circle'])} value={choiceShape} onValueChange={next=>setChoiceShape(next as typeof choiceShape)}/>
   <Switch label="Show scale anchors" checked={scaleAnchors} onCheckedChange={setScaleAnchors}/>
   <Select label="Answer appearance" options={selectOptions(['outlined','plain'])} value={frameAppearance} onValueChange={next=>setFrameAppearance(next as typeof frameAppearance)}/>
   <Select label="Button width" disabled={layout==='staggered'} options={selectOptions(['equal','content'])} value={layout==='staggered'?'equal':buttonWidth} onValueChange={next=>setButtonWidth(next as typeof buttonWidth)}/>
   <Select label="Layout" options={selectOptions(['inline','staggered'])} value={layout} onValueChange={next=>setLayout(next as typeof layout)}/>
   <Select label="Highlight appearance" options={selectOptions(['icon','background','both'])} value={appearance} onValueChange={next=>setAppearance(next as typeof appearance)}/>
   <Select label="Symbol highlighting" options={selectOptions(['cumulative','selected'])} value={highlight} onValueChange={next=>setHighlight(next as typeof highlight)}/>
  </Stack><Stack direction="row" wrap gap={3}>
   <Switch label="Show answer labels" checked={showLabels} onCheckedChange={setShowLabels}/><Switch label="Allow clearing" checked={clearable} onCheckedChange={setClearable}/>
   <Switch label="Disabled" checked={disabled} onCheckedChange={setDisabled}/><Switch label="Read only" checked={readOnly} onCheckedChange={setReadOnly}/>
   <Switch label="Required" checked={required} onCheckedChange={setRequired}/><Switch label="Invalid" checked={invalid} onCheckedChange={setInvalid}/>
  </Stack>
 </Stack>}>
  <Rating label={label} {...config.props} max={max} value={value} onValueChange={setValue} density={density} orientation={orientation} highlightMode={highlight} highlightAppearance={appearance} appearance={frameAppearance} choiceShape={choiceShape} scaleLabels={scaleAnchors?{start:'Not at all likely',middle:'Neutral',end:'Extremely likely'}:undefined} layout={layout} buttonWidth={buttonWidth} showOptionLabels={showLabels} clearable={clearable} disabled={disabled} readOnly={readOnly} required={required} invalid={invalid} description="Choose one answer. Nothing is selected until you respond." errorMessage="Choose a rating before continuing."/>
 </Example>;
}
function RatingReference({title,preset,orientation='horizontal',density='comfortable',max=5,initial=null,appearance='outlined',highlightMode,highlightAppearance,layout='inline',showOptionLabels=false,readOnly=false,disabled=false,invalid=false,description}: {
 title:string;preset:Preset;appearance?:'outlined'|'plain';orientation?:'horizontal'|'vertical';density?:Density;max?:number;initial?:number|null;highlightMode?:'cumulative'|'selected';highlightAppearance?:'icon'|'background'|'both';layout?:'inline'|'staggered';showOptionLabels?:boolean;readOnly?:boolean;disabled?:boolean;invalid?:boolean;description?:string;
}){
 const [value,setValue]=useState<number|null>(initial),config=presetConfig(preset);
 const question=preset==='likert'?'The session helped me understand the topic.':preset==='pain'?'How much pain are you experiencing?':'How helpful was this session?';
 const body=`<Rating label={${literal(question)}} ${config.code} max={${max}} value={value} onValueChange={setValue} density="${density}" orientation="${orientation}" appearance="${appearance}" ${highlightMode?`highlightMode="${highlightMode}"`:""} ${highlightAppearance?`highlightAppearance="${highlightAppearance}"`:""} layout="${layout}" showOptionLabels={${showOptionLabels}} clearable disabled={${disabled}} readOnly={${readOnly}} invalid={${invalid}}${description?` description={${literal(description)}}`:''}${invalid?' errorMessage="Confirm your answer."':''}/>`;
 return <Example title={title} density={density} source={exampleSource({name:'RatingExample',imports:[...imports,...(config.icons?[`import {${config.icons}} from '@structured-growth/sg-ui/icons';`]:[])],state:`${config.setup??''}\n  const [value,setValue]=useState<number|null>(${JSON.stringify(value)});`,body})}>
  <Rating label={question} {...config.props} max={max} value={value} onValueChange={setValue} density={density} orientation={orientation} appearance={appearance} highlightMode={highlightMode} highlightAppearance={highlightAppearance} layout={layout} showOptionLabels={showOptionLabels} clearable readOnly={readOnly} disabled={disabled} invalid={invalid} description={description} errorMessage={invalid?'Confirm your answer.':undefined}/>
 </Example>;
}
function SharedVectorRating(){
 const [value,setValue]=useState<number|null>(null);
 return <Example title="Repeated custom vector icon" source={exampleSource({name:'CustomVectorRating',imports:[...imports,"import {StarIcon} from '@structured-growth/sg-ui/icons';"],state:`  const [value,setValue]=useState<number|null>(${JSON.stringify(value)});`,body:'<Rating label="Rate the material" variant="icons" icon={<StarIcon/>} emptyIcon={<StarIcon strokeWidth={1}/>} value={value} onValueChange={setValue} clearable/>'})}>
  <Rating label="Rate the material" variant="icons" icon={<StarIcon/>} emptyIcon={<StarIcon strokeWidth={1}/>} value={value} onValueChange={setValue} clearable/>
 </Example>;
}
function RtlRatingExample(){
 const [value,setValue]=useState<number|null>(null);
 const body='<SGTranslationProvider value={{locale:"ar-SA",t:(_key,options)=>formatIcuMessage(options.defaultMessage,"ar-SA",options.values),useNamespace:()=>{}}}><Provider><Rating label="تقييم الجلسة" variant="numbers" value={value} onValueChange={setValue} clearable/></Provider></SGTranslationProvider>';
 return <Example title="Arabic locale and RTL" source={exampleSource({name:'ArabicRating',imports:[...imports,"import {SGTranslationProvider,formatIcuMessage} from '@structured-growth/sg-ui';"],state:`  const [value,setValue]=useState<number|null>(${JSON.stringify(value)});`,body})}>
  <SGTranslationProvider value={{locale:'ar-SA',t:(_key,options)=>formatIcuMessage(options.defaultMessage,'ar-SA',options.values),useNamespace:()=>{}}}><Provider><Rating label="تقييم الجلسة" variant="numbers" value={value} onValueChange={setValue} clearable/></Provider></SGTranslationProvider>
 </Example>;
}
function RatingFormExample(){
 const [result,setResult]=useState('');
 const body='<form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setResult(`Feedback draft: ${data.get("rating")} / 5.`);}} onReset={()=>setResult("")}><Stack gap={3}><Rating label="Session feedback" name="rating" required clearable description="Choose one rating before reviewing your feedback." errorMessage="Choose a rating."/><Stack direction="row" gap={2}><Button type="submit">Review feedback</Button><Button type="reset" variant="outlined">Reset feedback</Button></Stack>{result&&<Typography role="status">{result}</Typography>}</Stack></form>';
 return <Example title="Required survey answer and native reset" description="An unanswered rating submits no value. The native form requires a choice. Reviewing creates a local draft; persistence belongs to the host." source={exampleSource({name:'FeedbackForm',imports:["import {Rating,Stack,Button,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  const [result,setResult]=useState(${literal(result)});`,body})}>
  <form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setResult(`Feedback draft: ${data.get('rating')} / 5.`);}} onReset={()=>setResult('')}><Stack gap={3}>
   <Rating label="Session feedback" name="rating" required clearable description="Choose one rating before reviewing your feedback." errorMessage="Choose a rating."/>
   <Stack direction="row" gap={2}><Button type="submit">Review feedback</Button><Button type="reset" variant="outlined">Reset feedback</Button></Stack>{result&&<Typography role="status">{result}</Typography>}
  </Stack></form>
 </Example>;
}

function NumberedLikertExample(){
 const [value,setValue]=useState<number|null>(null);
 const options:RatingOption[]=likertOptions.map(option=>({...option,annotation:<Typography as="span" variant="body2">{option.label}</Typography>}));
 const body='<Rating label="The session helped me understand the topic." variant="numbers" options={options} value={value} onValueChange={setValue} orientation="horizontal" highlightMode="selected" highlightAppearance="background" clearable/>';
 const state=`  const [value,setValue]=useState<number|null>(${JSON.stringify(value)});\n  const options=[${likertOptions.map(option=>`{value:${option.value},label:${literal(option.label)},annotation:<Typography as="span" variant="body2">{${literal(option.label)}}</Typography>}`).join(',')}];`;
 return <Example title="Likert labels above numbered answers" description="Select 1–5. Agreement labels stay above their corresponding numbers; only the selected number is highlighted." source={exampleSource({name:'NumberedLikert',imports:["import {Rating,Typography} from '@structured-growth/sg-ui/primitives';"],state,body})}>
  <Rating label="The session helped me understand the topic." variant="numbers" options={options} value={value} onValueChange={setValue} orientation="horizontal" highlightMode="selected" highlightAppearance="background" clearable/>
 </Example>;
}

function LikelihoodScaleExample({orientation="horizontal",layout="inline"}:{orientation?:"horizontal"|"vertical";layout?:"inline"|"staggered"}={}){
 const [value,setValue]=useState<number|null>(null);
 const body=`<Rating orientation="${orientation}" layout="${layout}" label="How likely are you to recommend this session?" variant="numbers" max={7} choiceShape="circle" scaleLabels={{start:"Not at all likely",middle:"Neutral",end:"Extremely likely"}} value={value} onValueChange={setValue} highlightMode="selected" highlightAppearance="background" clearable/>`;
 return <Example title={layout==='staggered'?'Staggered likelihood with evenly spaced labels':orientation==='vertical'?'Vertical likelihood with evenly spaced labels':'Seven-point likelihood with evenly spaced labels'} description="Scale anchors are independent of the circular number choices. Long labels do not widen the buttons." source={exampleSource({name:'LikelihoodScale',imports,state:`  const [value,setValue]=useState<number|null>(${JSON.stringify(value)});`,body})}>
  <Rating orientation={orientation} layout={layout} label="How likely are you to recommend this session?" variant="numbers" max={7} choiceShape="circle" scaleLabels={{start:'Not at all likely',middle:'Neutral',end:'Extremely likely'}} value={value} onValueChange={setValue} highlightMode="selected" highlightAppearance="background" clearable/>
 </Example>;
}

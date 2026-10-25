'use client';
import {useState} from 'react';
import {Survey,SurveyQuestion,AnswerFeedback,type SurveyAnswer,type SurveyProps} from '@structured-growth/sg-ui';
import {Stack,Select,Switch,TextField,Typography} from '@structured-growth/sg-ui/primitives';
import {type Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';
const options=[{id:'text',label:'Text message'},{id:'call',label:'Phone call'},{id:'email',label:'Email'}];
export function SurveyExamples(){return <Stack gap={4}><SurveyPanel/><SurveyPanel reference modePreset="all"/><SurveyPanel reference modePreset="one" noBack/></Stack>;}
function SurveyPanel({reference=false,modePreset='one',noBack=false}:{reference?:boolean;modePreset?:'all'|'one';noBack?:boolean}){
 const [mode,setMode]=useState<'all'|'one'>(modePreset); const [allowBack,setAllowBack]=useState(!noBack);const [showProgress,setShowProgress]=useState(true); const [required,setRequired]=useState(true);const [title,setTitle]=useState('Communication preferences');const [density,setDensity]=useState<Density>('comfortable');
 const [active,setActive]=useState("channel");
 const [channel,setChannel]=useState<SurveyAnswer>(null);const [notes,setNotes]=useState<SurveyAnswer>(null);const [submitted,setSubmitted]=useState(false);
 const name=reference?(modePreset==='all'?'All questions together':'Forward-only questions'):'Prop playground';
 const body=`<Survey title={${literal(title)}} mode="${mode}" allowBack={${allowBack}} showProgress={${showProgress}} currentQuestionId={active} onQuestionChange={setActive} onSubmit={() => setSubmitted(true)}>
  <SurveyQuestion id="channel" prompt="How would you like to hear from us?" options={options} value={channel} onValueChange={value => {setChannel(value); setSubmitted(false);}} required={${required}} />
  <SurveyQuestion id="notes" prompt="What would make this helpful?" kind="text" value={notes} onValueChange={value => {setNotes(value); setSubmitted(false);}} />
</Survey>
{submitted && <AnswerFeedback title="Response prepared">This local example does not send or save your answers.</AnswerFeedback>}`;
 const source=exampleSource({name:'Survey',imports:["import {Survey, SurveyQuestion, AnswerFeedback, type SurveyAnswer} from '@structured-growth/sg-ui';"],state:`  const options = ${JSON.stringify(options)};
  const [active, setActive] = useState(${literal(active)});
  const [channel, setChannel] = useState<SurveyAnswer>(${JSON.stringify(channel)});
  const [notes, setNotes] = useState<SurveyAnswer>(${JSON.stringify(notes)});
  const [submitted, setSubmitted] = useState(${submitted});`,body:`<ThemeScope density="${density}">\n${body}\n</ThemeScope>`});
 return <Example title={name} density={density} source={source} controls={!reference&&<Stack gap={3}><TextField label="Survey title" value={title} onValueChange={setTitle}/><Select label="Question display" options={[{id:'one',label:'One at a time'},{id:'all',label:'All questions'}]} value={mode} onValueChange={value=>setMode(value as 'one'|'all')}/><Switch label="Allow Back" checked={allowBack} onCheckedChange={setAllowBack}/><Switch label="Show progress" checked={showProgress} onCheckedChange={setShowProgress}/><Switch label="Required first answer" checked={required} onCheckedChange={setRequired}/><Select label="Density" options={[{id:'compact',label:'Compact'},{id:'comfortable',label:'Comfortable'}]} value={density} onValueChange={value=>setDensity(value as Density)}/></Stack>}>
  <Survey title={title} mode={mode} allowBack={allowBack} showProgress={showProgress} currentQuestionId={active} onQuestionChange={setActive} onSubmit={()=>setSubmitted(true)}>
   <SurveyQuestion id="channel" prompt="How would you like to hear from us?" options={options} value={channel} onValueChange={value=>{setChannel(value);setSubmitted(false);}} required={required}/>
   <SurveyQuestion id="notes" prompt="What would make this helpful?" kind="text" value={notes} onValueChange={value=>{setNotes(value);setSubmitted(false);}}/>
  </Survey>
  {submitted&&<AnswerFeedback title="Response prepared">This local example does not send or save your answers.</AnswerFeedback>}
 </Example>;
}
export function SurveyQuestionExamples(){return <Stack gap={4}><QuestionPanel/><QuestionPanel reference kindPreset="multiple"/><QuestionPanel reference kindPreset="text"/><QuestionPanel reference kindPreset="rating"/></Stack>;}
function QuestionPanel({reference=false,kindPreset='single'}:{reference?:boolean;kindPreset?:'single'|'multiple'|'text'|'rating'}){
 const [kind,setKind]=useState(kindPreset); const [prompt,setPrompt]=useState('Which channel works for you?');const [required,setRequired]=useState(false);const [readOnly,setReadOnly]=useState(false);const [feedback,setFeedback]=useState(false);const [answer,setAnswer]=useState<SurveyAnswer>(null);
 const title=reference?`${kindPreset === 'multiple'?'Multiple answers':kindPreset === 'text'?'Written answer':'Rating answer'}`:'Prop playground';
 const source=exampleSource({name:'Question',imports:["import {SurveyQuestion, AnswerFeedback, type SurveyAnswer} from '@structured-growth/sg-ui';"],state:`  const options = ${JSON.stringify(options)};\n  const [answer, setAnswer] = useState<SurveyAnswer>(${JSON.stringify(answer)});`,body:`<SurveyQuestion id="preference" prompt={${literal(prompt)}} kind="${kind}" options={options} value={answer} onValueChange={setAnswer} required={${required}} readOnly={${readOnly}}${feedback?' feedback={<AnswerFeedback title="Thanks for considering your options">There is no right or wrong answer.</AnswerFeedback>}':''} />`});
 return <Example title={title} source={source} controls={!reference&&<Stack gap={3}><TextField label="Prompt" value={prompt} onValueChange={setPrompt}/><Select label="Answer type" options={['single','multiple','text','rating'].map(id=>({id,label:id}))} value={kind} onValueChange={value=>{setKind(value as typeof kind);setAnswer(null);}}/><Switch label="Required" checked={required} onCheckedChange={setRequired}/><Switch label="Read only" checked={readOnly} onCheckedChange={setReadOnly}/><Switch label="Show answer feedback" checked={feedback} onCheckedChange={setFeedback}/></Stack>}>
 <SurveyQuestion id="preference" prompt={prompt} kind={kind} options={options} value={answer} onValueChange={setAnswer} required={required} readOnly={readOnly} feedback={feedback?<AnswerFeedback title="Thanks for considering your options">There is no right or wrong answer.</AnswerFeedback>:undefined}/>
 </Example>;
}
export function AnswerFeedbackExamples(){return <Stack gap={4}><FeedbackPanel/><FeedbackPanel reference tonePreset="positive"/><FeedbackPanel reference tonePreset="negative"/></Stack>;}
function FeedbackPanel({reference=false,tonePreset='neutral'}:{reference?:boolean;tonePreset?:'neutral'|'positive'|'negative'}){
 const [tone,setTone]=useState(tonePreset);const [title,setTitle]=useState(tonePreset==='negative'?'Consider another approach':tonePreset==='positive'?'That is a useful approach':'More information');const [text,setText]=useState('Ask for clarification before deciding.');
 const source=exampleSource({name:'Feedback',imports:["import {AnswerFeedback} from '@structured-growth/sg-ui';"],body:`<AnswerFeedback title={${literal(title)}} tone="${tone}">{${literal(text)}}</AnswerFeedback>`});
 return <Example title={reference?`${tonePreset} feedback`:'Prop playground'} source={source} controls={!reference&&<Stack gap={3}><Select label="Tone" options={['neutral','positive','negative'].map(id=>({id,label:id}))} value={tone} onValueChange={value=>setTone(value as typeof tone)}/><TextField label="Feedback title" value={title} onValueChange={setTitle}/><TextField label="Explanation" value={text} onValueChange={setText}/></Stack>}><AnswerFeedback title={title} tone={tone}>{text}</AnswerFeedback></Example>;
}

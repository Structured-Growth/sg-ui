'use client';
import {useState} from 'react';
import {TextConversation,type ConversationMessage} from '@structured-growth/sg-ui';
import {Stack,Switch,TextField,Select} from '@structured-growth/sg-ui/primitives';
import {type Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';
const initial:ConversationMessage[]=[{id:'welcome',author:'Alex',text:'Hello! How can I help you today?',direction:'incoming'},{id:'reply',author:'You',text:'I have a question about my appointment.',direction:'outgoing'}];
export function TextConversationExamples(){return <Stack gap={4}><ConversationPanel/><ConversationPanel reference/><ConversationPanel reference failed/><ConversationPanel reference readOnlyPreset/></Stack>;}
function ConversationPanel({reference=false,failed=false,readOnlyPreset=false}:{reference?:boolean;failed?:boolean;readOnlyPreset?:boolean}){
 const [draft,setDraft]=useState('');
 const [messages,setMessages]=useState<ConversationMessage[]>(initial);const [title,setTitle]=useState('Support conversation');const [readOnly,setReadOnly]=useState(readOnlyPreset);const [typing,setTyping]=useState(false);const [disabled,setDisabled]=useState(false);const [density,setDensity]=useState<Density>('comfortable');const [reject,setReject]=useState(failed);
 const send=(text:string)=>{if(reject)throw Error('Example delivery failure');setMessages(current=>[...current,{id:`message-${current.length}`,author:'You',text,direction:'outgoing'},{id:`response-${current.length}`,author:'Alex',text:'Thank you. What would you like to know?',direction:'incoming'}]);};
 const source=exampleSource({name:'Conversation',imports:["import {TextConversation, type ConversationMessage} from '@structured-growth/sg-ui';",...(failed?["import {Switch} from '@structured-growth/sg-ui/primitives';"]:[])],state:`  const [draft, setDraft] = useState(${literal(draft)});
  const [messages, setMessages] = useState<ConversationMessage[]>(${JSON.stringify(messages)});
${failed?`  const [reject, setReject] = useState(${reject});\n`:''}  function send(text: string) {
${failed?'    if (reject) throw Error("Example delivery failure");\n':''}    setMessages(current => [...current,
      {id: 'message-' + current.length, author: 'You', text, direction: 'outgoing'},
      {id: 'response-' + current.length, author: 'Alex', text: 'Thank you. What would you like to know?', direction: 'incoming'}]);
  }`,body:`<ThemeScope density="${density}">\n${failed?'<Switch label="Simulate delivery failure" checked={reject} onCheckedChange={setReject} />\n':''}<TextConversation title={${literal(title)}} messages={messages} draft={draft} onDraftChange={setDraft} onSend={send} readOnly={${readOnly}} disabled={${disabled}}${typing?' typingLabel="Alex is typing…"':''}/>\n</ThemeScope>`});
 return <Example title={reference?(readOnlyPreset?'Read-only conversation':failed?'Failed delivery and retry':'Local scripted replies'):'Prop playground'} source={source} density={density} description={reference&&!readOnlyPreset?'Replies are a local demonstration. The host supplies real message transport or simulation.':undefined} controls={!reference&&<Stack gap={3}><TextField label="Conversation title" value={title} onValueChange={setTitle}/><Switch label="Read only" checked={readOnly} onCheckedChange={setReadOnly}/><Switch label="Typing indicator" checked={typing} onCheckedChange={setTyping}/><Switch label="Disabled composer" checked={disabled} onCheckedChange={setDisabled}/><Select label="Density" options={[{id:'comfortable',label:'Comfortable'},{id:'compact',label:'Compact'}]} value={density} onValueChange={value=>setDensity(value as Density)}/></Stack>}>
 {failed&&<Switch label="Simulate delivery failure" checked={reject} onCheckedChange={setReject}/>}
 <TextConversation title={title} messages={messages} draft={draft} onDraftChange={setDraft} onSend={send} readOnly={readOnly} disabled={disabled} typingLabel={typing?'Alex is typing…':undefined}/>
 </Example>;
}

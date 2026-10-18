'use client';
import {useRef,useState} from 'react';
import {PageRichTextEditorSection} from '@structured-growth/sg-ui/components';
import {Example} from '../components/Example';
import {exampleSource} from './source';
import {sampleEditorDocument} from './editor-sample-document';
const text=(value:string,format=0)=>({type:'text',version:1,text:value,detail:0,format,mode:'normal',style:''});
const element=(type:string,children:unknown[],extra={})=>({type,version:1,children,direction:null,format:'',indent:0,...extra});
const paragraph=(value:string)=>element('paragraph',[text(value)]);
const guide={root:element('root',[
  element('heading',[text('Design a meaningful learning activity')],{tag:'h2'}),
  element('paragraph',[text('Begin with a clear goal. ',1),text('Plan one activity that lets learners practice and reflect.')]),
  element('paragraph',[element('link',[text('Read the course planning guide')],{url:'https://example.com/course-guide',target:'_blank',rel:'noopener noreferrer',title:'Course planning guide'})]),
  element('list',[element('listitem',[text('Name the learning outcome')],{value:1}),element('listitem',[text('Choose evidence of progress')],{value:2}),element('listitem',[text('Plan feedback and reflection')],{value:3})],{listType:'number',start:1,tag:'ol'}),
  element('code',[text('const nextStep = "practice";')],{language:'javascript'}),
  element('table',[element('tablerow',[element('tablecell',[paragraph('Activity')],{colSpan:1,rowSpan:1,headerState:1}),element('tablecell',[paragraph('Duration')],{colSpan:1,rowSpan:1,headerState:1})]),element('tablerow',[element('tablecell',[paragraph('Practice and reflect')],{colSpan:1,rowSpan:1,headerState:0}),element('tablecell',[paragraph('15 minutes')],{colSpan:1,rowSpan:1,headerState:0})])]),
  element('paragraph',[{type:'image',version:1,src:'/course-guide.svg',altText:'Learning sequence: learn, practice, reflect',width:640,height:240,assetId:'course-guide',assetVersionId:'v1'}]),
  paragraph('Save your reflections before continuing to the next activity.'),
])};
export function SavedDocumentExample({readOnly=false}:{readOnly?:boolean}) {
  const [value,setValue]=useState<unknown>(guide);
  const body=`<PageRichTextEditorSection lexicalValue={value} onLexicalChange={setValue} editorKey="saved-course-guide" aria-label="Saved course guide" readOnly={${readOnly}} toolPreset="full" style={{height:480}} />`;
  return <Example title={readOnly?'Saved rich document — read only':'Saved rich document — editable'} description="Representative host-owned JSON contains headings, formatted text, a safe link, list, code, table and image. In the editable document, use Select table cells, then click the first and last cells to select a rectangle without dragging. Editing updates this example only; it does not persist. The host must serve /course-guide.svg or replace that image URL and metadata with its own asset." source={exampleSource({name:readOnly?'ReadOnlyCourseGuide':'EditableCourseGuide',imports:["import {PageRichTextEditorSection} from '@structured-growth/sg-ui/components';"],state:`  const [value,setValue]=useState<unknown>(${JSON.stringify(value)});`,body})}>
    <PageRichTextEditorSection lexicalValue={value} onLexicalChange={setValue} editorKey="saved-course-guide" aria-label="Saved course guide" readOnly={readOnly} toolPreset="full" style={{height:480}}/>
  </Example>;
}
export function HostImageUploadExample() {
  const [value,setValue]=useState<unknown>(()=>sampleEditorDocument());
  const attempted=useRef(false);
  async function uploadImage(file:File) {
    await new Promise(resolve=>setTimeout(resolve,350));
    if(!attempted.current){attempted.current=true;throw new Error('Sample upload failed. Retry with the same file.');}
    return {assetId:'course-guide',assetVersionId:'v1',src:'/course-guide.svg',altText:'Learning sequence: learn, practice, reflect',width:640,height:240};
  }
  const state=`  const [value,setValue]=useState<unknown>(${JSON.stringify(value)});
  const attempted=useRef(false);
  async function uploadImage(file:File) {
    await new Promise(resolve=>setTimeout(resolve,350));
    if(!attempted.current){attempted.current=true;throw new Error('Sample upload failed. Retry with the same file.');}
    return {assetId:'course-guide',assetVersionId:'v1',src:'/course-guide.svg',altText:'Learning sequence: learn, practice, reflect',width:640,height:240};
  }`;
  const body='<PageRichTextEditorSection lexicalValue={value} onLexicalChange={setValue} editorKey="host-upload-example" aria-label="Host image upload document" toolPreset="full" style={{height:420}} onUploadImage={uploadImage} />';
  return <Example title="Host image upload and retry" description="Choose Insert → Image. The local mock rejects its first upload, preserving the dialog for retry. A successful retry returns a predefined durable local asset instead of uploading the selected bytes. Serve /course-guide.svg for this sample. Production hosts own file transfer, access control, durable asset URLs/metadata, cancellation and storage; the editor ignores results after its document lifetime ends." source={exampleSource({name:'HostImageUpload',imports:["import {useRef} from 'react';","import {PageRichTextEditorSection} from '@structured-growth/sg-ui/components';"],state,body})}>
    <PageRichTextEditorSection lexicalValue={value} onLexicalChange={setValue} editorKey="host-upload-example" aria-label="Host image upload document" toolPreset="full" style={{height:420}} onUploadImage={uploadImage}/>
  </Example>;
}

import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { Provider } from '@structured-growth/sg-ui/experimental';
import { FloatingTextSelectionToolbar } from '@structured-growth/sg-ui/components/FloatingTextSelectionToolbar';
import { DocumentEditorLayout } from '@structured-growth/sg-ui/components/DocumentEditorLayout';
import { ContentEditorChrome } from '@structured-growth/sg-ui/components/ContentEditorChrome';
import { DocumentEditorToolbar } from '@structured-growth/sg-ui/components/DocumentEditorToolbar';
import { PageRichTextEditorSection } from '@structured-growth/sg-ui/components/PageRichTextEditorSection';
export function Proof({ browserProof = false }) {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => { if (browserProof) setHydrated(true); }, [browserProof]);
  const [documentVersion, setDocumentVersion] = React.useState(0);
  const [readOnly,setReadOnly]=React.useState(false);
  const [sectionValue,setSectionValue]=React.useState({root:{type:'root',version:1,children:Array.from({length:12},(_,i)=>({type:'paragraph',version:1,children:[{type:'text',version:1,text:'Packed course paragraph '+(i+1)+' for editing.',detail:0,format:0,mode:'normal',style:''}],direction:null,format:'',indent:0})),direction:null,format:'',indent:0}});
  const boundary=React.useRef(null); const [result,setResult]=React.useState('No command');
  return <Provider theme="dark" style={{background:'var(--sgui-surface)',color:'var(--sgui-text)'}}>
    <ContentEditorChrome title="Packed editor" icon={null} onTitleSave={setResult} menuItems={[{id:'file',label:'File',onPress:anchor=>setResult(anchor.textContent)}]} />
    <DocumentEditorLayout title="Document" style={{height:480}} toolbar={<DocumentEditorToolbar canEdit headingValue="normal" onHeadingChange={setResult} onZoomIn={()=>setResult('Zoom in')} actions={{bold:{active:true,onClick:()=>setResult('Document Bold')},italic:{active:false,onClick:()=>setResult('Document Italic')},bulletList:{active:false},orderedList:{active:false}}} />}>
      <div ref={boundary} style={{overflow:'auto',flex:1,minHeight:0}}>
        <LexicalComposer initialConfig={{namespace:'packed-editor',onError:error=>{throw error;},editorState:()=>{for(let i=0;i<15;i++)$getRoot().append($createParagraphNode().append($createTextNode('Select packed paragraph '+(i+1)+' for formatting.')));}}}>
          <FloatingTextSelectionToolbar boundaryRef={boundary} onRequestLink={()=>setResult('Floating link')} />
          <RichTextPlugin contentEditable={<ContentEditable aria-label="Packed document" style={{padding:16}} />} ErrorBoundary={LexicalErrorBoundary} placeholder={null} />
        </LexicalComposer>
      </div>
    </DocumentEditorLayout><button onClick={()=>setReadOnly(value=>!value)}>Toggle read only</button>
    {browserProof && <>
      <output aria-label="Hydration state">{hydrated ? 'hydrated' : 'server'}</output>
      <button onClick={() => setDocumentVersion(value => value + 1)}>Reload serialized course document</button>
      <button onClick={() => {
        setSectionValue({root:{type:'root',version:1,children:[{type:'paragraph',version:1,children:[{type:'text',version:1,text:'Replacement packed document',detail:0,format:1,mode:'normal',style:''}],direction:null,format:'',indent:0}],direction:null,format:'',indent:0}});
        setDocumentVersion(value => value + 1);
      }}>Replace course document</button>
    </>}
    <PageRichTextEditorSection lexicalValue={sectionValue} editorKey={browserProof ? 'packed-section-' + documentVersion : 'packed-section'} toolPreset="full" onLexicalChange={setSectionValue} readOnly={readOnly} aria-label="Packed course content" style={{height:480}} />
    <output aria-label="Serialized course content">{JSON.stringify(sectionValue)}</output><p role="status">{result}</p>
  </Provider>;
}

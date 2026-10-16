export const editorSampleText = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
].join('\n\n');

export function sampleEditorDocument(text = editorSampleText) {
  return {root:{type:'root',version:1,direction:null,format:'',indent:0,children:text.split(/\n\s*\n/).map(paragraph=>({
    type:'paragraph',version:1,direction:null,format:'',indent:0,
    children:[{type:'text',version:1,text:paragraph,detail:0,format:0,mode:'normal',style:''}],
  }))}};
}

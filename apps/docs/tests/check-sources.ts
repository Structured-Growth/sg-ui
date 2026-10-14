import ts from 'typescript';
import {resolve} from 'node:path';

export type SourceSnapshot={slug:string;source:string};
export function checkSources(sources:SourceSnapshot[]) {
 const files=new Map(sources.map((entry,index)=>[resolve(`.source-check/${entry.slug}-${index}.tsx`),entry.source]));
 const options:ts.CompilerOptions={strict:true,noEmit:true,skipLibCheck:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true};
 const host=ts.createCompilerHost(options);const get=host.getSourceFile.bind(host);
 host.getSourceFile=(file,language,onError,fresh)=>files.has(file)?ts.createSourceFile(file,files.get(file)!,ts.ScriptTarget.Latest,true):get(file,language,onError,fresh);
 return ts.getPreEmitDiagnostics(ts.createProgram([...files.keys()],options,host)).map(d=>`${d.file?.fileName}:${d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start).line+1:0} ${ts.flattenDiagnosticMessageText(d.messageText,'\n')}`);
}

interface ImportMeta {glob(pattern:string):Record<string,()=>Promise<unknown>>;}
declare module '*.module.css' {const classes:Record<string,string>;export default classes;}

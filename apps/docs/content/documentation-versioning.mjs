/** The release host supplies an immutable base URL and its own built route list. */
export function documentationVersionTarget(version, pathname) {
 if(version.id==='development'&&!version.baseUrl)return null;
 if(!/^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version.id))throw Error('Documentation releases require an exact version');
 const base=new URL(version.baseUrl);
 if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash)throw Error('Invalid documentation release base URL');
 const routes=version.routes;
 if(!Array.isArray(routes)||!routes.includes('/')||new Set(routes).size!==routes.length||routes.some(route=>!validPath(route)))throw Error('Documentation release requires its complete route manifest');
 const available=validPath(pathname)&&routes.includes(pathname);
 const target=new URL((available?pathname:'/').slice(1),base.href.replace(/\/?$/,'/'));
 if(!available&&validPath(pathname))target.searchParams.set('documentation-unavailable',pathname);
 return target.href;
}
function validPath(path) {
 return typeof path==='string'&&path.startsWith('/')&&!path.startsWith('//')&&!/[\\?#]/.test(path)&&new URL(path,'https://route.invalid').pathname===path;
}
/** URL text is data; never render it as a link or HTML. */
export function unavailableDocumentationPath(search) {
 const path=new URLSearchParams(search).get('documentation-unavailable');
 return path&&path.length<=512&&validPath(path)?path:null;
}

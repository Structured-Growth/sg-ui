import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {tokenTiers,defaultThemeTokens} from '@structured-growth/sg-ui/tokens';

// Node-only graph checks: transpile app-owned TS in memory, without a docs build.
const require=createRequire(import.meta.url);
const ts=require('typescript');
const cache=new Map();
function load(file) {
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const js=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const localRequire=id=>{
    if(id==='@structured-growth/sg-ui/tokens')return {tokenTiers,defaultThemeTokens};
    if(!id.startsWith('.'))return require(id);
    const base=resolve(dirname(file),id);
    const target=[base+'.ts',resolve(base,'index.ts')].find(existsSync);
    if(!target)throw new Error(`Unresolved theme test module: ${id}`);
    return load(target);
  };
  new Function('require','module','exports',js)(localRequire,module,module.exports);
  return module.exports;
}
const {themeGraph,semanticRoles,resolveTheme,resolveSemantics,semanticCssName,validateThemeGraph}=load(fileURLToPath(new URL('./index.ts',import.meta.url)));
const identities=['none','material','apple','editorial','structured-growth'];
function luminance(value) {
  assert.match(value,/^#[\da-f]{6}$/i,'Contrast pairs must resolve to opaque palette colors');
  const rgb=value.slice(1).match(/../g).map(part=>parseInt(part,16)/255).map(channel=>channel<=0.04045?channel/12.92:((channel+0.055)/1.055)**2.4);
  return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
}
function ratio(a,b) {const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}

test('app semantic role inventory matches the compiled public library contract',()=>{
  assert.deepEqual([...semanticRoles].sort(),[...tokenTiers.semantic].sort());
});

test('all identity/appearance/contrast maps contain exactly42 palette-backed semantic roles',()=>{
  assert.deepEqual(validateThemeGraph(),{identities:5,semanticRoles:42,maps:21});
  for(const identity of identities)for(const appearance of ['light','dark'])for(const contrast of ['standard','increased']) {
    const values=resolveSemantics(themeGraph.themes[identity][appearance][contrast]);
    assert.equal(Object.keys(values).length,42);
    const style=resolveTheme(identity,appearance,contrast);
    assert.equal(Object.keys(style).length,46);
    assert.ok(Object.values(style).every(value=>value!=='revert-layer'));
    assert.ok(Object.keys(style).every(key=>!key.startsWith('--sgui-button-')),'Component aliases belong to the owned scope layer');
    for(const role of semanticRoles)assert.equal(style[semanticCssName(role)],values[role]);
  }
});

test('graph validation rejects missing roles/references, directsemantic colors, cycles and missing modes',()=>{
  const change=mutate=>{const graph=structuredClone(themeGraph);mutate(graph);return graph;};
  assert.throws(()=>validateThemeGraph(change(graph=>delete graph.themes.material.light.standard.validationInfo)),/completeness.*validationInfo/);
  assert.throws(()=>validateThemeGraph(change(graph=>graph.themes.apple.dark.standard.action='palette.apple.missingBlue')),/Unknown palette reference/);
  assert.throws(()=>validateThemeGraph(change(graph=>graph.themes.editorial.light.standard.action='#ffffff')),/must reference named palettes/);
  assert.throws(()=>validateThemeGraph(change(graph=>{graph.themes.material.light.standard.text='semantic.textMuted';graph.themes.material.light.standard.textMuted='semantic.text';})),/reference cycle/);
  assert.throws(()=>validateThemeGraph(change(graph=>delete graph.themes['structured-growth'].dark.increased)),/contrast modes completeness.*increased/);
});

test('standard identities preserve their established accent, surface and website neutral/error roles',()=>{
  const expected={material:['#6750a4','#d0bcff','#fffbfe','#1c1b1f'],apple:['#005fcc','#64b5ff','#ffffff','#000000'],editorial:['#7c2d12','#fed7aa','#fffbeb','#1c1917'],'structured-growth':['#0b233e','#e2bd67','#ffffff','#0b1725']};
  for(const identity of identities.filter(identity=>identity!=='none')) {
    const light=resolveTheme(identity,'light'),dark=resolveTheme(identity,'dark');
    assert.deepEqual([light['--sgui-action'],dark['--sgui-action'],light['--sgui-surface'],dark['--sgui-surface']],expected[identity]);
  }
  const light=resolveTheme('structured-growth','light'),dark=resolveTheme('structured-growth','dark');
  assert.equal(light['--sgui-surface-subtle'],'#f5f6f8');
  assert.equal(light['--sgui-surface-selected'],'#e8f0fa');
  assert.equal(light['--sgui-control-radius'],'0.375rem');
  assert.equal(light['--sgui-action-neutral'],'#0b233e');assert.equal(dark['--sgui-action-neutral'],'#f5f7fa');
  assert.equal(light['--sgui-validation-error'],'#b91c1c');assert.equal(dark['--sgui-validation-error'],'#f87171');
});

test('standard text, primary action, border and focus pairs retain their minimum contrast',()=>{
  for(const identity of identities)for(const appearance of ['light','dark']) {
    const values=resolveSemantics(themeGraph.themes[identity][appearance].standard);
    const pair=(foreground,background,minimum)=>assert.ok(ratio(values[foreground],values[background])>=minimum,`${identity}/${appearance}: ${foreground} on ${background}`);
    for(const surface of ['surface','surfaceSubtle','surfaceRaised','surfaceOverlay']) {
      pair('text',surface,4.5);pair('textMuted',surface,4.5);pair('textSubtle',surface,4.5);pair('border',surface,3);pair('focus',surface,3);
    }
    for(const action of ['action','actionHover','actionPressed'])pair('onAction',action,4.5);
    for(const prefix of ['actionNeutral','actionDestructive'])for(const suffix of ['','Hover','Pressed']) {
      pair(prefix==='actionNeutral'?'onActionNeutral':'onActionDestructive',prefix+suffix,4.5);
    }
    for(const status of ['validationError','validationInfo','validationSuccess','validationWarning']) {
      pair(status,'surface',4.5);pair(status,'validationSurface',4.5);
    }
    pair('textSelected','surfaceSelected',4.5);pair('borderSelected','surfaceSelected',3);
    pair('text','surfaceHover',4.5);pair('text','surfacePressed',4.5);
  }
});

test('increased mode verifies named text, status, action, border and focus pairs across all identities',()=>{
  for(const identity of identities)for(const appearance of ['light','dark']) {
    const values=resolveSemantics(themeGraph.themes[identity][appearance].increased);
    const pair=(foreground,background,minimum)=>assert.ok(ratio(values[foreground],values[background])>=minimum,`${identity}/${appearance}: ${foreground} on ${background}`);
    for(const surface of ['surface','surfaceSubtle','surfaceRaised','surfaceOverlay']) {
      pair('text',surface,7);pair('textMuted',surface,7);pair('textSubtle',surface,7);pair('border',surface,3);pair('focus',surface,3);
    }
    for(const action of ['action','actionHover','actionPressed'])pair('onAction',action,7);
    for(const action of ['actionNeutral','actionNeutralHover','actionNeutralPressed'])pair('onActionNeutral',action,7);
    for(const action of ['actionDestructive','actionDestructiveHover','actionDestructivePressed'])pair('onActionDestructive',action,7);
    for(const status of ['validationError','validationInfo','validationSuccess','validationWarning'])pair(status,'validationSurface',7);
  }
});

test('forcedOS palette takes precedence over explicit appearance and contrast without affecting identity geometry',()=>{
  const forced=resolveSemantics(themeGraph.forcedColors);
  for(const identity of identities)for(const appearance of ['light','dark'])for(const contrast of ['standard','increased']) {
    const style=resolveTheme(identity,appearance,contrast,true);
    for(const role of semanticRoles)assert.equal(style[semanticCssName(role)],forced[role]);
    assert.equal(style['--sgui-surface'],'Canvas');assert.equal(style['--sgui-text'],'CanvasText');
    assert.equal(style['--sgui-action'],'Highlight');assert.equal(style['--sgui-on-action'],'HighlightText');
    assert.equal(style['--sgui-font-family'],themeGraph.identitySettings[identity].fontFamily);
    assert.equal(style['--sgui-focus-width'],'0.1875rem');
  }
});


test('None uses generated public library color defaults without website identity leakage',()=>{
  for(const appearance of ['light','dark']) {
    const values=resolveTheme('none',appearance,'standard');
    for(const role of semanticRoles)assert.equal(values[semanticCssName(role)],defaultThemeTokens[appearance][semanticCssName(role)]);
    assert.equal(values['--sgui-font-family'],defaultThemeTokens[appearance]['--sgui-font-family']);
    assert.equal(values['--sgui-control-radius'],defaultThemeTokens[appearance]['--sgui-control-radius']);
  }
});

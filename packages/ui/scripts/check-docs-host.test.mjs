import {test} from 'node:test';
import assert from 'node:assert/strict';
import {docsHostFindings} from './check-docs-host.mjs';
const host='apps/docs/native-fixtures';
function fixture(){return {
 'package.json':'{}','packages/ui/package.json':'{}','apps/docs/package.json':'{}','pnpm-lock.yaml':"lockfileVersion: '9.0'",
 [`${host}/module-manifest.json`]:JSON.stringify({modules:[{fixture:`${host}/scenarios/one.tsx`,scenarioModule:true}]}),
 [`${host}/registry.json`]:JSON.stringify({entries:{one:{id:'one',module:'./scenarios/one.tsx',importPath:'./scenarios/one.tsx'}}}),
 [`${host}/scenarios/one.tsx`]:'export const One = {};',
};}
test('checks the current fixture inventory without requiring historical identities',()=>assert.deepEqual(docsHostFindings(fixture()),[]));
test('rejects reintroduced dependencies, locked nodes, CI commands and all source import forms',()=>{
 for(const [path,text] of [
  ['package.json','{"devDependencies":{"@storybook/react":"1"}}'],
  ['apps/docs/package.json','{"scripts":{"old":"build-storybook"}}'],
  ['pnpm-lock.yaml',"packages:\n  '@storybook/react@1.0.0': {}"],
  ['.github/workflows/ci.yml','run: pnpm build:storybook'],
  ['packages/ui/src/Old.stories.tsx','export {};'],
  ...['import type {X} from "@storybook/react";','export {X} from "storybook";','import("@storybook/test");','require("@storybook/react");','type X = import("@storybook/react").X;'].map(code=>['apps/docs/component.tsx',code]),
 ]){const files=fixture();files[path]=text;assert(docsHostFindings(files).length,`${path}: ${text}`);}
});
test('registry drift, missing fixtures and unmapped scenario content remain failures',()=>{
 const missing=fixture();delete missing[`${host}/scenarios/one.tsx`];assert(docsHostFindings(missing).some(f=>f.message.includes('Missing')));
 const registry=fixture();registry[`${host}/registry.json`]='{"entries":{}}';assert(docsHostFindings(registry).some(f=>f.message.includes('no registered')));
 const changed=fixture();changed[`${host}/registry.json`]=changed[`${host}/registry.json`].replace('./scenarios/one.tsx','./scenarios/other.tsx');assert(docsHostFindings(changed).some(f=>f.message.includes('does not match')));
});

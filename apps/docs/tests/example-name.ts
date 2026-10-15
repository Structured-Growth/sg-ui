import catalog from '../content/catalog.json' with {type:'json'};
const escape=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const prefixes=[...new Set(catalog.map(entry=>entry.title))].map(escape).join('|');
/** Accept the component heading prefix without matching “Show source” regions. */
export function exampleName(name:string|RegExp) {
  return typeof name==='string'?new RegExp(`^(?:(?:${prefixes}): )?${escape(name)}$`):name;
}

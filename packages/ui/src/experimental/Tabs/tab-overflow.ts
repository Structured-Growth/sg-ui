/** Keep a primary prefix; reserve the last visible slot for an otherwise hidden selection. */
export function resolveTabOverflow(
  items: readonly {id:string; priority?:'primary'|'secondary'}[],
  selected: string | undefined,
  widths: Readonly<Record<string,number>>,
  available: number,
  moreWidth: number,
) {
  const primary=items.filter(item=>item.priority!=='secondary');
  const active=items.find(item=>item.id===selected);
  const candidates=active?.priority==='secondary' ? [...primary,active] : primary;
  const width=(id:string)=>widths[id]??0;
  if(candidates.length===items.length && candidates.reduce((sum,item)=>sum+width(item.id),0)<=available)
    return candidates.map(item=>item.id);
  const budget=Math.max(0,available-moreWidth);
  const visible:string[]=[]; let used=0;
  for(const item of primary) {
    if(used+width(item.id)>budget)break;
    visible.push(item.id);used+=width(item.id);
  }
  if(active&&!visible.includes(active.id)) {
    while(visible.length&&used+width(active.id)>budget)used-=width(visible.pop()!);
    visible.push(active.id);
  }
  return visible;
}

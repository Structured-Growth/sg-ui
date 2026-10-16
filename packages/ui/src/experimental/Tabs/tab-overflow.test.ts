import {describe,it,expect} from 'vitest';
import {resolveTabOverflow} from './tab-overflow';
describe('tab overflow allocation',()=>{
  const items=[{id:'a'},{id:'b'},{id:'c'},{id:'extra',priority:'secondary' as const}];
  const widths={a:80,b:100,c:120,extra:220};
  it('reserves the menu and promotes a hidden selection into the final fitting slot',()=>{
    expect(resolveTabOverflow(items,'c',widths,250,40)).toEqual(['a','c']);
    expect(resolveTabOverflow(items,'extra',widths,250,40)).toEqual(['extra']);
    expect(resolveTabOverflow(items,'a',widths,250,40)).toEqual(['a','b']);
  });
  it('keeps secondary tabs out with spare room and returns primary order as space grows',()=>{
    expect(resolveTabOverflow(items,'b',widths,1000,40)).toEqual(['a','b','c']);
    expect(resolveTabOverflow(items,'extra',widths,1000,40)).toEqual(['a','b','c','extra']);
    expect(resolveTabOverflow(items.slice(0,3),'c',widths,300,40)).toEqual(['a','b','c']);
  });
  it('keeps an oversized selected item reachable and handles empty or removed selections',()=>{
    expect(resolveTabOverflow(items,'extra',widths,60,40)).toEqual(['extra']);
    expect(resolveTabOverflow([],undefined,{},0,40)).toEqual([]);
    expect(resolveTabOverflow(items,'removed',widths,250,40)).toEqual(['a','b']);
  });
});

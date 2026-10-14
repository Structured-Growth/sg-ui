import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
export {within,userEvent};
/** Native fixture assertions preserve the original checks without a runner runtime. */
export function expect(actual:unknown) {
 function checks(negated:boolean) {
  const assert=(condition:boolean,message:string)=>{if(negated?condition:!condition)throw new Error(message);};
  return {
   toBe:(expected:unknown)=>assert(Object.is(actual,expected),`Expected ${String(actual)} ${negated?'not ':''}to be ${String(expected)}`),
   toBeGreaterThan:(expected:number)=>assert(typeof actual==='number'&&actual>expected,`Expected ${String(actual)} ${negated?'not ':''}greater than ${expected}`),
   toHaveAttribute:(name:string,value?:string)=>assert(actual instanceof Element&&(value===undefined?actual.hasAttribute(name):actual.getAttribute(name)===value),`Expected element ${negated?'not ':''}to have ${name}${value===undefined?'':'='+value}`),
   toHaveFocus:()=>assert(actual===document.activeElement,`Expected element ${negated?'not ':''}to have native focus`),
   toHaveTextContent:(text:string)=>assert(actual instanceof Element&&(actual.textContent??'').includes(text),`Expected element ${negated?'not ':''}to include ${text}`),
  };
 }
 return {...checks(false),not:checks(true)};
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {validateExampleIsolation} from './check-example-isolation.mjs';
test('separate component instances may each own one panel',()=>{
 assert.equal(validateExampleIsolation('function First(){return <Example><Button/></Example>;} function Second(){return <Example children={<Button/>}/>;} function Page(){return <><First/><Second/></>;}'),2);
});
test('multiple panels cannot share one component owner',()=>{
 assert.throws(()=>validateExampleIsolation('function Shared(){return <><Example/><Example><Button/></Example></>;}'),/own state owner/);
});
test('mapped panels cannot capture page state through an inline callback',()=>{
 assert.throws(()=>validateExampleIsolation('function Page(){return values.map(value=><Example><Button onPress={()=>setValue(value)}/></Example>);}'),/inline\/mapped/);
});

import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('shared defaults, nested scopes and explicit overrides remain independent',async({page})=>{
 await page.goto('/docs/components/form-field-scope');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const preview=panel.locator('[data-docs-preview]');
 const name=preview.getByRole('textbox',{name:'Name',exact:true});
 const country=preview.getByRole('button',{name:/Country/});
 const notes=preview.getByRole('textbox',{name:'Notes',exact:true});
 const before=async(text:string,control:typeof name)=>{
  const message=preview.getByText(text,{exact:true});
  return (await message.boundingBox())!.y<(await control.boundingBox())!.y;
 };
 expect(await before('As shown on your account.',name)).toBe(false);
 expect(await before('Confirm your name.',name)).toBe(true);
 expect(await before('Where you live.',country)).toBe(false);
 expect(await before('Confirm your country.',country)).toBe(false);
 expect(await before('Optional details.',notes)).toBe(true);
 await name.fill('Grace');
 await panel.getByRole('button',{name:/Scope description placement/}).click();await page.getByRole('option',{name:'Above control',exact:true}).click();
 await panel.getByRole('button',{name:/Scope error placement/}).click();await page.getByRole('option',{name:'Below control',exact:true}).click();
 expect(await before('As shown on your account.',name)).toBe(true);
 expect(await before('Confirm your name.',name)).toBe(false);
 expect(await before('Where you live.',country)).toBe(true);
 expect(await before('Confirm your country.',country)).toBe(false);
 await expect(name).toHaveValue('Grace');
 for(const density of ['compact','comfortable']){
  const sibling=page.getByRole('region',{name:exampleName(`Nested defaults and field overrides — ${density}`),exact:true});
  await expect(sibling.getByRole('textbox',{name:'Name',exact:true})).toHaveValue('Ada');
  await sibling.getByRole('button',{name:`Show source: Nested defaults and field overrides — ${density}`,exact:true}).click();
  expect(checkSources([{slug:'form-field-scope',source:(await sibling.getByRole('code').textContent())!}])).toEqual([]);
 }
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;
 expect(source).toContain('descriptionPlacement="above" errorPlacement="below"');expect(source).toContain('useState("Grace")');
 expect(checkSources([{slug:'form-field-scope',source}])).toEqual([]);
 await page.setViewportSize({width:375,height:900});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

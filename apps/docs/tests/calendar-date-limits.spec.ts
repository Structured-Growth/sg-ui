import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('relative date limits update source independently; flight window includes its boundaries',async({page})=>{
 await page.clock.setFixedTime(new Date('2026-12-31T12:00:00'));
 await page.goto('/docs/components/calendar');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const flight=page.getByRole('region',{name:exampleName('Flight booking — today through two months ahead'),exact:true});
 await expect(panel.getByRole('button',{name:/Year choices/})).toHaveCount(0);
 for(const [label,value] of [['Earliest selectable date','Today'],['Latest selectable date','2 months from today']]){
   await panel.getByRole('button',{name:new RegExp(label)}).click();
   await page.getByRole('option',{name:value,exact:true}).click();
 }
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;
 expect(source).toContain('min="2026-12-31"');expect(source).toContain('max="2027-02-28"');
 const preview=flight.locator('[data-docs-preview]');
 await expect(preview.getByRole('button',{name:/December 30, 2026/})).toBeDisabled();
 await preview.getByRole('button',{name:/December 31, 2026/}).click();
 await expect(preview.getByRole('gridcell',{name:/December 31, 2026/})).toHaveAttribute('aria-selected','true');
 await preview.getByRole('button',{name:'Next month',exact:true}).click();
 await preview.getByRole('button',{name:'Next month',exact:true}).click();
 await expect(preview.getByRole('button',{name:'Next month',exact:true})).toBeDisabled();
 await preview.getByRole('button',{name:/February 28, 2027/}).click();
 await expect(preview.getByRole('gridcell',{name:/February 28, 2027/})).toHaveAttribute('aria-selected','true');
 await flight.getByRole('button',{name:'Show source: Flight booking — today through two months ahead',exact:true}).click();
 const flightSource=(await flight.getByRole('code').textContent())!;
 expect(flightSource).toContain('2027-02-28');
 expect(await panel.getByRole('code').textContent()).toBe(source);
 expect(checkSources([{slug:'calendar',source},{slug:'flight-booking',source:flightSource}])).toEqual([]);
});

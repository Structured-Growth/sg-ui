import {test,expect} from './fixtures';
import {exampleName} from './example-name';

test('split actions fit their contents in vertical layouts at both densities',async({page})=>{
  await page.goto('/docs/components/split-action');
  const panel=page.getByRole('region',{name:exampleName('Compact and comfortable comparison'),exact:true});
  const groups=panel.getByRole('group',{name:'Save course',exact:true});
  await expect(groups).toHaveCount(2);
  for(const group of await groups.all()) {
    const geometry=await group.evaluate(element=>{
      const box=element.getBoundingClientRect();
      const children=Array.from(element.children).map(child=>child.getBoundingClientRect());
      return {width:box.width,parent:element.parentElement!.getBoundingClientRect().width,
        content:children.reduce((sum,child)=>sum+child.width,0),gap:children[1].left-children[0].right};
    });
    expect(geometry.width).toBeLessThan(geometry.parent*.75);
    expect(geometry.width).toBeCloseTo(geometry.content+2,0);
    expect(geometry.gap).toBeCloseTo(0,0);
    await group.getByRole('button',{name:'Save course',exact:true}).click();
    await group.getByRole('button',{name:'More actions',exact:true}).click();
    await expect(page.getByRole('menuitem',{name:'Save a copy',exact:true})).toBeVisible();
    await page.getByRole('menuitem',{name:'Save a copy',exact:true}).click();
    await expect(page.getByRole('menu')).toHaveCount(0);
  }
});

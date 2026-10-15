import {exampleName} from './example-name';
import {test,expect} from '@playwright/test';
const generalPages=[
  {slug:'installation',label:'Installation',title:'Installation'},
  {slug:'theming',label:'Theming',title:'Theming'},
  {slug:'releases',label:'Release history',title:'Release history'},
  {slug:'licensing',label:'Licenses',title:'Commercial licensing'},
];

test('general pages use root URLs, retain navigation and redirect old docs URLs',async({page,request})=>{
  for(const item of generalPages) {
    const response=await request.get(`/docs/${item.slug}?from=bookmark`,{maxRedirects:0});
    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location,'http://127.0.0.1:3100').pathname).toBe(`/${item.slug}`);
    expect(new URL(response.headers().location,'http://127.0.0.1:3100').search).toBe('?from=bookmark');
    await page.goto(`/docs/${item.slug}`);
    await expect(page).toHaveURL(new RegExp(`/${item.slug}$`));
    await expect(page.getByRole('heading',{level:1,name:exampleName(item.title),exact:true})).toBeVisible();
    await expect(page.getByRole('region',{name:exampleName('Demo settings'),exact:true})).toHaveCount(0);
    const link=page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:item.label,exact:true});
    await expect(link).toHaveAttribute('href',`/${item.slug}`);
    await expect(link).toHaveAttribute('aria-current','page');
  }
  await page.goto('/');
  await page.getByRole('main').getByRole('link',{name:'Get started →',exact:true}).click();
  await expect(page).toHaveURL(/\/installation$/);
  const nav=page.getByRole('navigation',{name:'Documentation',exact:true});
  await nav.getByRole('button',{name:'Buttons & actions',exact:true}).click();
  await nav.getByRole('link',{name:'AppButton',exact:true}).click();
  await expect(page).toHaveURL(/\/docs\/components\/button$/);
  await expect(page.getByRole('navigation',{name:'Component tools navigation'}).getByRole('button',{name:'Demo settings',exact:true})).toBeVisible();
  await expect(page.getByRole('region',{name:'Demo settings',exact:true})).toHaveCount(0);
});

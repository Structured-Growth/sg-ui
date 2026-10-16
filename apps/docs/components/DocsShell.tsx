'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { IconPanelNavigation } from '@structured-growth/sg-ui/components';
import { BrushIcon, DescriptionIcon } from '@structured-growth/sg-ui/icons';
import catalog from '../content/catalog.json';
import { DemoSettingsToolbar } from './DemoSettingsToolbar';
import { PageDocumentationContext } from './PageDocumentation';
import { Surface } from '@structured-growth/sg-ui/experimental';
import { usePathname, useRouter } from 'next/navigation';
import { Provider, ThemeScope } from '@structured-growth/sg-ui/theme';
import { SGNavigationProvider } from '@structured-growth/sg-ui/adapters';
import { Box, Stack, Typography, Link } from '@structured-growth/sg-ui/primitives';
import { Select } from '@structured-growth/sg-ui/experimental';
import { CatalogNavigation } from './CatalogNavigation';
import { DemoSettingsProvider } from './DemoSettings';
import { docsTheme } from './docs-theme';
import { documentationVersions } from '../content/navigation';
import styles from './docs.module.css';
import { useStableDocumentWidth } from './useStableDocumentWidth';
export function DocsShell({ children }: { children: React.ReactNode }) {
  useStableDocumentWidth();
  const pathname = usePathname(); const router = useRouter();
  const [documentation,setDocumentation]=useState<{pathname:string;content:ReactNode}|null>(null);
  const [activeTool,setActiveTool]=useState<string|null>(null);
  const componentPage=catalog.some(entry=>pathname===`/docs/components/${entry.slug}`);
  const registerDocumentation=useCallback((route:string,content:ReactNode)=>{
    const value={pathname:route,content};setDocumentation(value);
    return ()=>setDocumentation(current=>current===value?null:current);
  },[]);
  const tools=[
    {id:'demo-settings',label:'Demo settings',icon:<BrushIcon/>,content:<DemoSettingsToolbar/>},
    {id:'documentation',label:'Page documentation',icon:<DescriptionIcon/>,content:documentation?.pathname===pathname?documentation.content:null},
  ];
  const mainRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLElement>(null);
  useEffect(()=>{
    mainRef.current?.scrollTo({top:0,left:0,behavior:'instant'});
    toolsRef.current?.querySelectorAll<HTMLElement>('[data-sgui-part="icon-navigation-content"]')[1]?.scrollTo({top:0,left:0,behavior:'instant'});
  },[pathname]);
  return <SGNavigationProvider value={{ pathname, navigate: (href, options) => options?.replace ? router.replace(href) : router.push(href) }}>
    <PageDocumentationContext.Provider value={registerDocumentation}><DemoSettingsProvider><Provider density="compact" theme="light" style={docsTheme('light')} className={styles.root}>
      <Link href="#main-content" className={styles.skip}>Skip to content</Link>
      <Box as="header" padding={2} className={styles.header}>
        <Stack direction="row" wrap align="center" justify="between" gap={3}>
          <Stack gap={0}><Link href="/" underline="none"><Typography as="span" variant="subtitle2">Structured Growth UI</Typography></Link><Typography className={styles.applicationDescription} variant="caption" tone="muted">Component documentation</Typography></Stack>
          <Stack direction="row" wrap align="end" gap={2}>
            <Select className={styles.versionPicker} label="Documentation version" value="development" options={documentationVersions.map(v => ({ id: v.id, label: v.label }))} onValueChange={id => { const v = documentationVersions.find(v => v.id === id); if (v?.baseUrl) window.location.assign(`${v.baseUrl}${pathname}`); }} />
          </Stack>
        </Stack>
      </Box>
      <Box className={styles.layout} data-has-tools={componentPage||undefined}>
        <Surface as="nav" tabIndex={0} aria-label="Documentation" padding={2} className={styles.sidebar}>
          <CatalogNavigation pathname={pathname}/>
          <Stack gap={2} className={styles.navigationMeta}>
            <Typography variant="caption" tone="muted">Development documentation. Version 1 has not been released.</Typography>
            <Link href="https://github.com/Structured-Growth/sg-ui">View on GitHub</Link>
            <Typography variant="caption" tone="muted">Public source. Commercial license required.</Typography>
          </Stack>
        </Surface>
        <Box ref={mainRef} as="main" id="main-content" tabIndex={-1} className={styles.main}><Box className={styles.mainContent} style={{padding:"clamp(1rem, 2vw, 2rem)"}}>{children}</Box></Box>
        {componentPage&&<Box ref={toolsRef} as="aside" aria-label="Component tools" className={styles.tools} data-active-tool={activeTool??undefined}>
          <ThemeScope density="compact" className={styles.toolsScope}><IconPanelNavigation items={tools} activeId={activeTool} onActiveIdChange={setActiveTool} side="end" panelWidth="var(--docs-tool-panel-width)" aria-label="Component tools navigation"/></ThemeScope>
        </Box>}
      </Box>
    </Provider></DemoSettingsProvider></PageDocumentationContext.Provider>
  </SGNavigationProvider>;
}

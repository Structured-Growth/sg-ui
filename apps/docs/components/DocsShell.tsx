'use client';
import { Surface } from '@structured-growth/sg-ui/experimental';
import { usePathname, useRouter } from 'next/navigation';
import { Provider } from '@structured-growth/sg-ui/theme';
import { SGNavigationProvider } from '@structured-growth/sg-ui/adapters';
import { Box, Stack, Typography, Link } from '@structured-growth/sg-ui/primitives';
import { Select } from '@structured-growth/sg-ui/experimental';
import { CatalogNavigation } from './CatalogNavigation';
import { DemoSettingsProvider } from './DemoSettings';
import { DemoSettingsToolbar } from './DemoSettingsToolbar';
import { docsTheme } from './docs-theme';
import { navigation, documentationVersions } from '../content/navigation';
import styles from './docs.module.css';
import { useStableDocumentWidth } from './useStableDocumentWidth';
export function DocsShell({ children }: { children: React.ReactNode }) {
  useStableDocumentWidth();
  const pathname = usePathname(); const router = useRouter();
  return <SGNavigationProvider value={{ pathname, navigate: (href, options) => options?.replace ? router.replace(href) : router.push(href) }}>
    <DemoSettingsProvider><Provider theme="light" style={docsTheme('light')} className={styles.root}>
      <Link href="#main-content" className={styles.skip}>Skip to content</Link>
      <Box as="header" padding={4} className={styles.header}>
        <Stack direction="row" wrap align="center" justify="between" gap={3}>
          <Stack gap={0}><Link href="/" underline="none"><Typography as="span" variant="h5">Structured Growth UI</Typography></Link><Typography variant="caption" tone="muted">Component documentation</Typography></Stack>
          <Stack direction="row" wrap align="end" gap={2}>
            <Select label="Documentation version" value="development" options={documentationVersions.map(v => ({ id: v.id, label: v.label }))} onValueChange={id => { const v = documentationVersions.find(v => v.id === id); if (v?.baseUrl) window.location.assign(`${v.baseUrl}${pathname}`); }} />
          </Stack>
        </Stack>
      </Box>
      <DemoSettingsToolbar />
      <Box className={styles.layout}>
        <Surface as="nav" aria-label="Documentation" tone="subtle" padding={4} className={styles.sidebar}>
          <Typography variant="overline">Explore SGUI</Typography>
          <Stack gap={2}>{navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className={styles.navLink}>{item.label}</Link>)}</Stack>
          <CatalogNavigation pathname={pathname}/><Typography variant="caption" tone="muted">Development documentation. Version 1 has not been released.</Typography>
        </Surface>
        <Box as="main" id="main-content" tabIndex={-1} style={{padding:"clamp(1rem, 4vw, 4rem)"}} className={styles.main}>{children}</Box>
      </Box>
      <Box as="footer" padding={4} className={styles.footer}><Typography variant="caption" tone="muted">Public source. Commercial license required.</Typography><Link href="https://github.com/Structured-Growth/sg-ui">View source on GitHub</Link></Box>
    </Provider></DemoSettingsProvider>
  </SGNavigationProvider>;
}

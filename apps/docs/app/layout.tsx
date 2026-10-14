import type { Metadata } from 'next';
import '@structured-growth/sg-ui/styles.css';
import './globals.css';
import { DocsShell } from '../components/DocsShell';
export const metadata: Metadata = { title: { default: 'Structured Growth UI', template: '%s · SGUI' }, description: 'Explore the Structured Growth UI component library, examples and integration guides.' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><DocsShell>{children}</DocsShell></body></html>;
}

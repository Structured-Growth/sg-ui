export const navigation = [
  { label: 'Overview', href: '/' },
  { label: 'Installation', href: '/installation' },
  { label: 'Components', href: '/docs/components' },
  { label: 'Buttons', href: '/docs/components/button' },
  { label: 'Dialogs', href: '/docs/components/dialog' },
  { label: 'Theming', href: '/theming' },
  { label: 'Release history', href: '/releases' },
  { label: 'Licenses', href: '/licensing' },
];
// Populate with validated immutable deployments when releases exist.
export const documentationVersions: DocumentationVersion[] = [
  { id: 'development', label: 'Development · unreleased', baseUrl: '' },
];
import type {DocumentationVersion} from './documentation-versioning.mjs';

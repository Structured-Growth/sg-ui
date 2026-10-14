export const navigation = [
  { label: 'Overview', href: '/' },
  { label: 'Installation', href: '/docs/installation' },
  { label: 'Components', href: '/docs/components' },
  { label: 'Buttons', href: '/docs/components/button' },
  { label: 'Dialogs', href: '/docs/components/dialog' },
  { label: 'Theming', href: '/docs/theming' },
  { label: 'Release history', href: '/docs/releases' },
  { label: 'Licensing', href: '/docs/licensing' },
];
// Populate with validated immutable deployments when releases exist.
export const documentationVersions: { id: string; label: string; baseUrl: string }[] = [
  { id: 'development', label: 'Development · unreleased', baseUrl: '' },
];

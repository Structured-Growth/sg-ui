import { Typography, Link, Stack } from '@structured-growth/sg-ui/primitives';
export default function NotFound() { return <Stack gap={3}><Typography as="h1" variant="h3">Page not found</Typography><Typography>This documentation page is not available.</Typography><Link href="/docs/components">Browse components</Link></Stack>; }

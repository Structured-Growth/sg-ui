import { Surface } from '@structured-growth/sg-ui/experimental';
import { Typography, Link } from '@structured-growth/sg-ui/primitives';
import { DocPage, Code } from '../../components/DocPage';
export const metadata = {title:"Release history"};
export default function Page() { return <DocPage title="Release history" description="Read documentation that matches the library you use."><Surface variant="outlined" padding={4}><Typography as="h2" variant="h5">Development · unreleased</Typography><Typography>No public version 1 release exists yet. The version selector will link to validated documentation snapshots as releases become available.</Typography></Surface><Typography>Each release will retain its own package, documentation and live examples. Historical releases will run in separate deployments to keep their styles and APIs isolated.</Typography></DocPage>; }

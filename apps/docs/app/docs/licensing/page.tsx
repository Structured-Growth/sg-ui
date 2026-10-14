import { Typography, Link } from '@structured-growth/sg-ui/primitives';
import { DocPage, Code } from '../../../components/DocPage';
export const metadata = {title:"Commercial licensing"};
export default function Page() { return <DocPage title="Commercial licensing" description="Public source with a written commercial license."><Typography>SGUI requires a written commercial agreement from Structured Growth. Public repository access and npm availability do not grant free-use rights.</Typography><Link href="https://github.com/Structured-Growth/sg-ui/blob/main/LICENSE">Read the current license</Link><Typography>Purchasing and account features will be added when the licensing workflow is established.</Typography></DocPage>; }

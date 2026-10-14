import { DocPage } from '../../../../components/DocPage';
import { DialogPlayground } from '../../../../examples/DialogPlayground';
import { ComponentUsage } from '../../../../components/ComponentUsage';
export const metadata = {title:'Dialogs'};
export default function Dialogs() { return <DocPage title="Dialogs" description="Try sizes, explicit dismissal and host-owned form actions."><ComponentUsage slug="dialog"/><DialogPlayground /></DocPage>; }

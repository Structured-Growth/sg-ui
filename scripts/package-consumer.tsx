// This fixture typechecks only against built package entry points.
import { AppButton, AppModal, AppDataGrid, PageRichTextEditorSection } from '@structured-growth/sg-ui';
import { Typography } from '@structured-growth/sg-ui/primitives';
import { darkTheme } from '@structured-growth/sg-ui/theme';
import { SGNavigationProvider } from '@structured-growth/sg-ui/adapters';
import type { AppDataGridColumn } from '@structured-growth/sg-ui/components';
const columns: AppDataGridColumn<{ id: string; name: string }>[] = [{ field: 'name', headerName: 'Name', cellType: 'text' }];
export const example = <SGNavigationProvider value={{ pathname: '/', navigate: () => {} }}>
  <AppButton>Save</AppButton>
  <Typography variant="bodyAlt2">Custom typography</Typography>
  <AppModal open={false} title="Example" onClose={() => {}}>Content</AppModal>
  <AppDataGrid rows={[{ id: 'one', name: 'Example' }]} columns={columns} />
  <PageRichTextEditorSection lexicalValue={null} editorKey="example" onLexicalChange={() => {}} />
</SGNavigationProvider>;
export const theme = darkTheme;

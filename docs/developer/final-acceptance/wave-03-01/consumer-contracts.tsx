import { useState } from 'react';
import {
  AppDataGrid, AppModal, Button, ThemeScope,
  usePersistentState, type AppDataGridColumn, type AppModalCloseReason,
  type ButtonProps, type MenuProps,
  type TypographyProps,
} from '@structured-growth/sg-ui';
import { Dialog, type DialogProps, type DateFieldProps, type PopoverProps } from '@structured-growth/sg-ui/experimental';

type Course = { id: string; name: string };
const columns: AppDataGridColumn<Course>[] = [{ field: 'name', headerName: 'Course', flex: 1 }];
export function ConsumerMigration({ rows }: { rows: Course[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tab, setTab] = usePersistentState('courses-tab', 'list', { storage: 'session' });
  return <ThemeScope density="comfortable">
    <Button onPress={() => { setTab(tab === 'list' ? 'cards' : 'list'); setOpen(true); }}>Edit course</Button>
    <AppDataGrid<Course> rows={rows} columns={columns} label="Courses" getRowLabel={row => row.name} getRowId={row => row.id}
      selection={{ selectedRowIds: selected, onSelectedRowIdsChange: setSelected }} />
    <AppDataGrid<Course> rows={rows} columns={columns} label="Courses without selection" getRowLabel={row => row.name} selection={false} />
    <AppModal open={open} title="Edit course" onClose={(_reason: AppModalCloseReason) => setOpen(false)}
      primaryAction={{ label: 'Done', onPress: () => setOpen(false) }}><p>Host owns saving.</p></AppModal>
    <Dialog open={false} title="Course details" onDismiss={() => setOpen(false)}><p>Course details</p></Dialog>
  </ThemeScope>;
}
const button: ButtonProps = { variant: 'outlined', tone: 'neutral', density: 'compact', onPress: () => {} };
const dialog: DialogProps = { open: false, children: null, onDismiss: reason => { const accepted: 'escape'|'outside'|'close-button'|'dismiss' = reason; void accepted; } };
const menuPlacement: MenuProps['placement'] = 'bottom start';
const popoverSize: PopoverProps['size'] = 'content';
const field: DateFieldProps = { label: 'Due date', value: null, entryMode: 'segments', onValidityChange: valid => { const boolean: boolean = valid; void boolean; } };
const textTone: TypographyProps['tone'] = 'primary';
// @ts-expect-error Button no longer accepts upstream click events.
const oldClick: ButtonProps = { onClick: () => {} };
// @ts-expect-error No upstream contained variant.
const oldVariant: ButtonProps = { variant: 'contained' };
// @ts-expect-error Popover and Dialog have distinct size domains.
const oldPopoverSize: PopoverProps['size'] = 'sm';
// @ts-expect-error Old engine dismissal reason is removed.
const oldReason: AppModalCloseReason = 'backdropClick';
// @ts-expect-error AppModal callback no longer receives event plus reason.
const oldModal: Parameters<typeof AppModal>[0] = { open: false, children: null, onClose: (_event: unknown, _reason: string) => {} };
// @ts-expect-error Custom row identity must return string.
const oldIdentity = <AppDataGrid rows={[{ id: 1, name: 'Course' }]} columns={[{ field: 'name', headerName: 'Course' }]} label="Courses" getRowLabel={row => row.name} getRowId={row => row.id} />;
void [button, dialog, menuPlacement, popoverSize, field, textTone, oldClick, oldVariant, oldPopoverSize, oldReason, oldModal, oldIdentity];

// Guide snippet begins (uses the AppDataGrid import above).
export function CoursesWithoutSelection({ rows }: { rows: { id: string; name: string }[] }) {
  return <AppDataGrid<{ id: string; name: string }>
    label="Courses" rows={rows} getRowLabel={row => row.name}
    columns={[{ field: 'name', headerName: 'Course', flex: 1 }]}
    selection={false} />;
}

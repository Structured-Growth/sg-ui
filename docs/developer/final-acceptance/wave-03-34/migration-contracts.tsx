import type { ButtonProps } from '@structured-growth/sg-ui/components/Button';
import type { AppGridRowSelectionModel, AppGridPaginationModel, AppDataGridSelectionConfig } from '@structured-growth/sg-ui/components/AppDataGrid';
const selection: AppGridRowSelectionModel = new Set(['course-1']);
const pagination: AppGridPaginationModel = {page: 0, pageSize: 10};
const config: AppDataGridSelectionConfig<{id:string}> = {selectedRowIds: selection, onSelectedRowIdsChange: next => { const ids: Set<string> = next; }};
// @ts-expect-error Retired style engine props are not an owned Button contract.
const retired: ButtonProps = {sx: {color: 'red'}};
// @ts-expect-error Upstream event objects are not part of onPress.
const eventCallback: ButtonProps = {onPress: (event: MouseEvent) => {}};
// @ts-expect-error Engine include/exclude selection objects are not SGUI ID sets.
const engineSelection: AppGridRowSelectionModel = {type: 'include', ids: new Set(['course-1'])};
export {selection,pagination,config,retired,eventCallback,engineSelection};
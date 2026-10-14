import type { DataToolbarColumnOption } from "./components/DataToolbarColumnsMenu";

type BaseColumnOption = {
  id: string;
  label: string;
  locked?: boolean;
};

const toLabel = (id: string): string =>
  id
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (first) => first.toUpperCase());

export const buildDataToolbarColumnOptions = <RowModel extends object>({
  baseOptions,
  columnVisibilityModel,
  rows,
  includeInferredFields = false,
}: {
  baseOptions: readonly BaseColumnOption[];
  columnVisibilityModel: Readonly<Record<string, boolean>>;
  rows: readonly RowModel[];
  includeInferredFields?: boolean;
}): DataToolbarColumnOption[] => {
  const explicitIds = new Set(baseOptions.map((option) => option.id));
  const labelsById = new Map(baseOptions.map((option) => [option.id, option.label]));
  const orderedIds: string[] = [...explicitIds];

  if (includeInferredFields) {
    for (const row of rows) {
      for (const fieldId of Object.keys(row as Record<string, unknown>)) {
        if (!labelsById.has(fieldId)) {
          labelsById.set(fieldId, toLabel(fieldId));
        }
        if (!orderedIds.includes(fieldId)) {
          orderedIds.push(fieldId);
        }
      }
    }
  }

  const idsWithActionsLast = orderedIds.filter((id) => id !== "actions");
  if (orderedIds.includes("actions")) {
    idsWithActionsLast.push("actions");
  }

  const lockedById = new Map(baseOptions.map((option) => [option.id, option.locked ?? false]));

  return idsWithActionsLast.map((id) => ({
    id,
    label: labelsById.get(id) ?? toLabel(id),
    locked: id === "actions" ? true : (lockedById.get(id) ?? false),
    visible: id === "actions" ? true : (columnVisibilityModel[id] ?? explicitIds.has(id)),
  }));
};

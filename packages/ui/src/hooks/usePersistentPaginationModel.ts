"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePersistentState, type PersistentStateOptions } from "./usePersistentState";

import { normalizePaginationModel, type PaginationModel, type PaginationNormalizationOptions } from "./paginationModel";

export { normalizePaginationModel, APP_PAGE_SIZE_OPTIONS } from "./paginationModel";
export type { PaginationModel, PaginationNormalizationOptions } from "./paginationModel";

export interface PersistentPaginationModelOptions extends PaginationNormalizationOptions,
  Omit<PersistentStateOptions<PaginationModel>, "validate"> {}

const isPaginationModel = (value: unknown): value is PaginationModel =>
  value !== null && typeof value === "object" && "page" in value && "pageSize" in value &&
  typeof value.page === "number" && typeof value.pageSize === "number";

export function usePersistentPaginationModel(
  key: string | undefined = undefined,
  initialValue: PaginationModel = { page: 0, pageSize: 25 },
  options: PersistentPaginationModelOptions = {},
) {
  const { pageSizeOptions, defaultPageSize } = options;
  const [value, setValue] = usePersistentState<PaginationModel>(key, normalizePaginationModel(initialValue, options), {
    storage: options.storage,
    version: options.version,
    migrate: options.migrate,
    validate: isPaginationModel,
  });
  const normalizedValue = useMemo(
    () => normalizePaginationModel(value, { pageSizeOptions, defaultPageSize }),
    [value, pageSizeOptions, defaultPageSize],
  );

  useEffect(() => {
    if (normalizedValue.page !== value.page || normalizedValue.pageSize !== value.pageSize) setValue(normalizedValue);
  }, [normalizedValue, setValue, value.page, value.pageSize]);

  const setNormalizedValue = useCallback(
    (nextValue: PaginationModel | ((prevValue: PaginationModel) => PaginationModel)) => {
      setValue(previousValue => normalizePaginationModel(
        typeof nextValue === "function" ? nextValue(normalizePaginationModel(previousValue, { pageSizeOptions, defaultPageSize })) : nextValue,
        { pageSizeOptions, defaultPageSize },
      ));
    },
    [setValue, pageSizeOptions, defaultPageSize],
  );

  return [normalizedValue, setNormalizedValue] as const;
}

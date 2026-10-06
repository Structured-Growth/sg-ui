"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePersistentState } from "./usePersistentState";

export type PaginationModel = {
  page: number;
  pageSize: number;
};

export const APP_PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const normalizePageSize = (pageSize: number): number => {
  if (!Number.isFinite(pageSize)) {
    return APP_PAGE_SIZE_OPTIONS[0];
  }

  if (pageSize > APP_PAGE_SIZE_OPTIONS[APP_PAGE_SIZE_OPTIONS.length - 1]) {
    return APP_PAGE_SIZE_OPTIONS[APP_PAGE_SIZE_OPTIONS.length - 1];
  }

  const exactMatch = APP_PAGE_SIZE_OPTIONS.find((value) => value === pageSize);
  if (exactMatch) {
    return exactMatch;
  }

  const roundedUp = APP_PAGE_SIZE_OPTIONS.find((value) => value >= pageSize);
  return roundedUp as number;
};

export const normalizePaginationModel = (model: PaginationModel): PaginationModel => {
  const normalizedPage = Number.isFinite(model.page) && model.page > 0 ? Math.floor(model.page) : 0;

  return {
    page: normalizedPage,
    pageSize: normalizePageSize(model.pageSize),
  };
};

export function usePersistentPaginationModel(key: string, initialValue: PaginationModel = { page: 0, pageSize: 25 }) {
  const [value, setValue] = usePersistentState<PaginationModel>(key, normalizePaginationModel(initialValue));
  const normalizedValue = useMemo(
    () => normalizePaginationModel(value),
    [value],
  );

  useEffect(() => {
    if (normalizedValue.page !== value.page || normalizedValue.pageSize !== value.pageSize) {
      setValue(normalizedValue);
    }
  }, [normalizedValue, setValue, value.page, value.pageSize]);

  const setNormalizedValue = useCallback(
    (nextValue: PaginationModel | ((prevValue: PaginationModel) => PaginationModel)) => {
      setValue((previousValue) => {
        const normalizedPrevious = normalizePaginationModel(previousValue);
        const resolved =
          typeof nextValue === "function"
            ? (nextValue as (prevValue: PaginationModel) => PaginationModel)(normalizedPrevious)
            : nextValue;

        return normalizePaginationModel(resolved);
      });
    },
    [setValue],
  );

  return [normalizedValue, setNormalizedValue] as const;
}

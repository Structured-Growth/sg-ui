export type PaginationModel = { page: number; pageSize: number };

/** Suggested menu choices, not a pagination policy or maximum. */
export const APP_PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export interface PaginationNormalizationOptions {
  /** Omit to accept every positive integer. Invalid/duplicate choices are ignored. */
  pageSizeOptions?: readonly number[];
  /** Defaults to 25. Invalid sizes fall back to this normalized size. */
  defaultPageSize?: number;
}

const positiveInteger = (value: number): number | undefined =>
  Number.isSafeInteger(Math.floor(value)) && value >= 1 ? Math.floor(value) : undefined;

export const normalizePaginationModel = (
  model: PaginationModel,
  options: PaginationNormalizationOptions = {},
): PaginationModel => {
  const sizes = [...new Set(options.pageSizeOptions?.filter(size => Number.isSafeInteger(size) && size > 0) ?? [])].sort((a, b) => a - b);
  const requested = positiveInteger(model.pageSize) ?? positiveInteger(options.defaultPageSize ?? 25) ?? 25;
  const pageSize = sizes.length ? sizes.find(size => size >= requested) ?? sizes[sizes.length - 1]! : requested;
  return {
    page: Number.isSafeInteger(Math.floor(model.page)) && model.page > 0 ? Math.floor(model.page) : 0,
    pageSize,
  };
};


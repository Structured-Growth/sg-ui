/** Shared display normalization. Hosts remain authoritative; rendering never emits callbacks. */
export function normalizeCardPagination(page: number, pageSize: number, totalCount?: number | null) {
  const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 25;
  const count = typeof totalCount === "number" && Number.isFinite(totalCount) && totalCount >= 0
    ? Math.floor(totalCount) : undefined;
  const pageCount = count === undefined ? undefined : Math.ceil(count / size);
  const index = Number.isFinite(page) ? Math.max(0, Math.floor(page)) : 0;
  return { page: pageCount === undefined ? index : Math.min(index, Math.max(0, pageCount - 1)), pageSize: size, count, pageCount };
}

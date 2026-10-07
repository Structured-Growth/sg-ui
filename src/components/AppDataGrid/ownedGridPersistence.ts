"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DataToolbarFilterField, DataToolbarFilterRule } from "../DataToolbar/DataToolbar";
import { normalizeOwnedGridLayout, type OwnedGridPresentationColumn } from "./ownedGridColumns";
import { normalizeGridFilterRules, normalizeGridPagination, normalizeGridSortRules, type OwnedGridPageSizeOption, type OwnedGridPaginationModel, type OwnedGridSortRule } from "./ownedGridModel";

/** A per-view key is required; storage access is optional and may fail safely. */
export interface OwnedGridStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export interface OwnedGridPersistenceConfig {
  key: string;
  storage?: OwnedGridStorage;
}
/** Intentionally excludes selection, host rows, request state and errors. */
export interface OwnedGridPersistedState {
  paginationModel?: OwnedGridPaginationModel;
  sortRules?: readonly OwnedGridSortRule[];
  filterRules?: readonly DataToolbarFilterRule[];
  searchValue?: string;
  columnVisibilityModel?: Readonly<Record<string, boolean>>;
  columnOrder?: readonly string[];
  columnWidths?: Readonly<Record<string, number>>;
  viewMode?: "list" | "cards";
}
export interface OwnedGridPersistenceOptions<Row> {
  persistence?: OwnedGridPersistenceConfig;
  columns: readonly OwnedGridPresentationColumn<Row>[];
  filterFields?: readonly DataToolbarFilterField[];
  pageSizeOptions?: readonly OwnedGridPageSizeOption[];
}
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
export const ownedGridPersistenceKey = (key: string): string => `sgui:grid:${key}:v1`;
const legacyKeys = (key: string) => [`datagrid:${key}:paginationModel`, `page:${key}:viewMode`, `page:${key}:columnVisibilityModel`, `page:${key}:cardsPaginationModel`];
function storageFor(config: OwnedGridPersistenceConfig | undefined): OwnedGridStorage | undefined {
  if (!config?.key.trim()) return undefined;
  if (config.storage) return config.storage;
  try { return typeof window === "undefined" ? undefined : window.localStorage; } catch { return undefined; }
}
function readJSON(storage: OwnedGridStorage, key: string): unknown {
  try { const text = storage.getItem(key); return text === null ? undefined : JSON.parse(text); } catch { return undefined; }
}
/** Validate untrusted JSON before passing it to the shared typed normalizers. */
export function normalizeOwnedGridPersistedState<Row>(input: unknown, options: OwnedGridPersistenceOptions<Row>): OwnedGridPersistedState {
  if (!record(input)) return {};
  const result: OwnedGridPersistedState = {};
  const pagination = input.paginationModel;
  if (record(pagination) && typeof pagination.page === "number" && Number.isSafeInteger(pagination.page) && pagination.page >= 0
    && typeof pagination.pageSize === "number" && Number.isSafeInteger(pagination.pageSize) && pagination.pageSize > 0) {
    result.paginationModel = normalizeGridPagination({ page: pagination.page, pageSize: pagination.pageSize }, options.pageSizeOptions);
  }
  if (Array.isArray(input.sortRules)) {
    const rules = input.sortRules.filter((rule): rule is OwnedGridSortRule => record(rule) && typeof rule.field === "string" && (rule.direction === "asc" || rule.direction === "desc"));
    result.sortRules = normalizeGridSortRules(rules, options.columns);
  }
  if (Array.isArray(input.filterRules)) {
    const rules = input.filterRules.filter((rule): rule is DataToolbarFilterRule => record(rule) && typeof rule.field === "string" && typeof rule.operator === "string" && typeof rule.value === "string");
    result.filterRules = normalizeGridFilterRules(rules.map(rule => ({ field: rule.field, operator: rule.operator, value: rule.value })), options.columns, options.filterFields);
  }
  if (typeof input.searchValue === "string") result.searchValue = input.searchValue;
  if (input.viewMode === "list" || input.viewMode === "cards") result.viewMode = input.viewMode;
  if (record(input.columnVisibilityModel)) {
    result.columnVisibilityModel = normalizeOwnedGridLayout(options.columns, { visibility: Object.fromEntries(Object.entries(input.columnVisibilityModel).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean")) }).visibility;
  }
  if (Array.isArray(input.columnOrder)) {
    result.columnOrder = normalizeOwnedGridLayout(options.columns, { order: input.columnOrder.filter((field): field is string => typeof field === "string") }).order;
  }
  if (record(input.columnWidths)) {
    result.columnWidths = normalizeOwnedGridLayout(options.columns, { widths: Object.fromEntries(Object.entries(input.columnWidths).filter((entry): entry is [string, number] => typeof entry[1] === "number" && Number.isFinite(entry[1]) && entry[1] > 0)) }).widths;
  }
  return result;
}
export function readOwnedGridPersistence<Row>(options: OwnedGridPersistenceOptions<Row>): OwnedGridPersistedState {
  const config = options.persistence;
  const storage = storageFor(config);
  if (!storage || !config) return {};
  const saved = readJSON(storage, ownedGridPersistenceKey(config.key));
  // An incompatible future schema must not revive stale legacy state.
  if (saved !== undefined) return record(saved) && saved.version === 1 ? normalizeOwnedGridPersistedState(saved.state, options) : {};
  const [paginationKey, viewKey, visibilityKey, cardsKey] = legacyKeys(config.key);
  const list = normalizeOwnedGridPersistedState({ paginationModel: readJSON(storage, paginationKey!) }, options);
  const cards = normalizeOwnedGridPersistedState({ paginationModel: readJSON(storage, cardsKey!) }, options);
  // Retired sortModel/filterModel are deliberately not interpreted as owned rules.
  return { ...normalizeOwnedGridPersistedState({ viewMode: readJSON(storage, viewKey!), columnVisibilityModel: readJSON(storage, visibilityKey!) }, options),
    ...(list.paginationModel ? list : cards) };
}
/** Mount controllers only when ready so restored defaults seed once after hydration.
 * Controlled values remain authoritative. Without persistence, ready is immediate. */
export function useOwnedGridPersistence<Row>(options: OwnedGridPersistenceOptions<Row>) {
  // A mounted view owns one key. Remount when changing the persistence identity.
  const [initialOptions] = useState(() => options);
  const [restoration, setRestoration] = useState<{ defaults: OwnedGridPersistedState; ready: boolean }>(() => ({
    defaults: {}, ready: !initialOptions.persistence?.key.trim(),
  }));
  useEffect(() => {
    if (initialOptions.persistence?.key.trim()) setRestoration({ defaults: readOwnedGridPersistence(initialOptions), ready: true });
  }, [initialOptions]);
  const lastObserved = useRef<string | undefined>(undefined);
  const pendingReset = useRef<{ previous: string | undefined; desired: string } | undefined>(undefined);
  const persist = useCallback((snapshot: OwnedGridPersistedState) => {
    const normalized = normalizeOwnedGridPersistedState(snapshot, options);
    const signature = JSON.stringify(normalized);
    lastObserved.current = signature;
    if (pendingReset.current !== undefined) {
      if (pendingReset.current.previous === signature && pendingReset.current.desired !== signature) return;
      // A changed resolved snapshot is a host acceptance (possibly an alternative)
      // or a new interaction, so persistence resumes without an indefinite gate.
      pendingReset.current = undefined;
    }
    const config = initialOptions.persistence;
    const storage = storageFor(config);
    if (!config || !storage) return;
    try { storage.setItem(ownedGridPersistenceKey(config.key), JSON.stringify({ version: 1, state: normalized })); } catch { /* Persistence never blocks an interaction. */ }
  }, [initialOptions, options]);
  const reset = useCallback((snapshot?: OwnedGridPersistedState) => {
    const normalized = snapshot === undefined ? undefined : normalizeOwnedGridPersistedState(snapshot, options);
    pendingReset.current = normalized === undefined ? undefined : { previous: lastObserved.current, desired: JSON.stringify(normalized) };
    const config = initialOptions.persistence;
    const storage = storageFor(config);
    if (!config || !storage) return;
    for (const key of [ownedGridPersistenceKey(config.key), ...legacyKeys(config.key)]) {
      try { storage.removeItem(key); } catch { /* A blocked key must not prevent clearing other keys. */ }
    }
    if (normalized !== undefined) {
      try { storage.setItem(ownedGridPersistenceKey(config.key), JSON.stringify({ version: 1, state: normalized })); } catch { /* Reset remains usable without storage. */ }
    }
  }, [initialOptions, options]);
  return { ...restoration, persist, reset };
}

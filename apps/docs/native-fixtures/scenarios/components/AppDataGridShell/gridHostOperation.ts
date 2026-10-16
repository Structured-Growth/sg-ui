/** Consumer example only: the host owns persistence, revisions and translated messages. */
export function createGridHostOperation<Row>(initial: readonly Row[], save: (
  rows: readonly Row[], operation: { id: number; signal: AbortSignal },
) => Promise<readonly Row[]>) {
  type Snapshot = { rows: readonly Row[]; phase: "ready" | "pending" | "error" | "saved" | "canceled"; error?: string };
  let confirmed = initial;
  let snapshot: Snapshot = { rows: initial, phase: "ready" };
  let sequence = 0;
  let pending: AbortController | undefined;
  let retryRows: readonly Row[] | undefined;
  const listeners = new Set<() => void>();
  const publish = (next: Snapshot) => { snapshot = next; listeners.forEach(listener => listener()); };
  const invalidate = () => { ++sequence; pending?.abort(); pending = undefined; };
  const request = async (next: readonly Row[]) => {
    invalidate();
    const id = sequence;
    const controller = new AbortController();
    pending = controller; retryRows = next;
    publish({ rows: next, phase: "pending" });
    try {
      const accepted = await save(next, { id, signal: controller.signal });
      if (id !== sequence || controller.signal.aborted) return "discarded" as const;
      confirmed = accepted; pending = undefined; retryRows = undefined;
      publish({ rows: confirmed, phase: "saved" });
      return "saved" as const;
    } catch (failure) {
      if (id !== sequence || controller.signal.aborted) return "discarded" as const;
      pending = undefined;
      publish({ rows: confirmed, phase: "error", error: failure instanceof Error ? failure.message : "Save failed" });
      return "error" as const;
    }
  };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    request,
    retry: () => retryRows && snapshot.phase === "error" ? request(retryRows) : Promise.resolve("discarded" as const),
    cancel() { const wasPending = Boolean(pending); invalidate(); retryRows = undefined; if (wasPending) publish({ rows: confirmed, phase: "canceled" }); },
    replace(rows: readonly Row[]) { invalidate(); confirmed = rows; retryRows = undefined; publish({ rows, phase: "ready" }); },
  };
}

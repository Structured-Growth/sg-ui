import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { AppButton } from "../components/AppButton";
import { Typography } from "../primitives";
import { usePersistentState } from "./usePersistentState";

const key = "sgui-batch15-recovery";
function Counter({ name, storage, storageKey = key, initial = 3 }: {
  name: string; storage: "local" | "session" | false; storageKey?: string; initial?: number;
}) {
  const [value, setValue] = usePersistentState(storageKey, initial, { storage });
  return <div>
    <output aria-label={`${name} value`}>{value}</output>{" "}
    <AppButton onPress={() => setValue(3)}>Save {name} 3</AppButton>{" "}
    <AppButton onPress={() => setValue(5)}>Save {name} 5</AppButton>{" "}
    <AppButton onPress={() => setValue(previous => previous + 1)}>Increment {name}</AppButton>
  </div>;
}
type Kind = "local" | "session";
type Metrics = { injected: boolean; failed: number; successful: number; saved: string | null };
function StorageViews({ kind, metrics, ready, toggleFailure }: {
  kind: Kind; metrics: Metrics; ready: boolean; toggleFailure: () => void;
}) {
  const [peer, setPeer] = useState(true);
  const { injected, failed, successful, saved } = metrics;
  return <section aria-label={`${kind} views`}>
    <Typography variant="h3">{kind} storage</Typography>
    <output aria-label={`${kind} harness ready`}>{ready ? "ready" : "preparing"}</output>{" "}
    <output aria-label={`${kind} saved bytes`}>{saved ?? "absent"}</output>{" "}
    <output aria-label={`${kind} successful writes`}>{successful}</output>{" "}
    <output aria-label={`${kind} failed writes`}>{failed}</output>
    <div><AppButton onPress={toggleFailure}>{injected ? `Recover ${kind} writes` : `Inject ${kind} quota failure`}</AppButton>{" "}
      <AppButton onPress={() => setPeer(previous => !previous)}>{peer ? `Unmount ${kind} peer` : `Remount ${kind} peer`}</AppButton>
    </div>
    <Counter name={`${kind} primary`} storage={kind} />
    {peer && <Counter name={`${kind} peer`} storage={kind} />}
    <Counter name={`${kind} distinct key`} storage={kind} storageKey={`${key}-other`} initial={9} />
    <Counter name={`${kind} memory primary`} storage={false} initial={11} />
    <Counter name={`${kind} memory peer`} storage={false} initial={11} />
  </section>;
}
function RecoveryExample() {
  const fail = useRef({ local: false, session: false });
  const [ready, setReady] = useState(false);
  const empty: Metrics = { injected: false, failed: 0, successful: 0, saved: null };
  const [metrics, setMetrics] = useState<Record<Kind, Metrics>>({ local: empty, session: empty });
  useEffect(() => {
    const stores = { local: window.localStorage, session: window.sessionStorage };
    const descriptor = Object.getOwnPropertyDescriptor(Storage.prototype, "setItem")!;
    const original = Storage.prototype.setItem;
    // Single host-owned interceptor, exact key/storage matching, restored on unmount.
    Object.defineProperty(Storage.prototype, "setItem", { ...descriptor, value: function (this: Storage, name: string, value: string) {
      const kind = this === stores.local ? "local" : this === stores.session ? "session" : undefined;
      if (!kind || name !== key) return original.call(this, name, value);
      if (fail.current[kind]) {
        setMetrics(previous => ({ ...previous, [kind]: { ...previous[kind], failed: previous[kind].failed + 1 } }));
        throw new DOMException("Story-injected quota failure", "QuotaExceededError");
      }
      original.call(this, name, value);
      setMetrics(previous => ({ ...previous, [kind]: {
        ...previous[kind], successful: previous[kind].successful + 1, saved: this.getItem(key),
      } }));
    } });
    const refresh = () => setMetrics(previous => ({
      local: { ...previous.local, saved: stores.local.getItem(key) },
      session: { ...previous.session, saved: stores.session.getItem(key) },
    }));
    window.addEventListener("storage", refresh);
    refresh(); setReady(true);
    return () => {
      window.removeEventListener("storage", refresh);
      Object.defineProperty(Storage.prototype, "setItem", descriptor);
    };
  }, []);
  const toggleFailure = (kind: Kind) => {
    fail.current[kind] = !fail.current[kind];
    setMetrics(previous => ({ ...previous, [kind]: { ...previous[kind], injected: fail.current[kind] } }));
  };
  return <div>
    <Typography variant="body1">Opt-in local and session consumers share only their own key/storage scope. Save primary 3, inject a quota failure, save 5, recover writes, then save 3. Saved bytes remain 3 and recovery adds no storage write. Increment or remount the peer to inspect recovery.</Typography>
    <Typography variant="body1">Quota failure is injected, not real capacity exhaustion. Mounted peers demonstrate same-document notification. A separate browser case uses two pages for native local-storage events; session storage is scoped to its browsing context. Memory-only counters remain independent even with the same key. Saved values survive story remounts; local fallback does not survive document reload.</Typography>
    <StorageViews kind="local" metrics={metrics.local} ready={ready} toggleFailure={() => toggleFailure("local")} />
    <StorageViews kind="session" metrics={metrics.session} ready={ready} toggleFailure={() => toggleFailure("session")} />
  </div>;
}
const meta = { title: "Hooks/Persistent state", component: RecoveryExample } satisfies Meta<typeof RecoveryExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const QuotaRecovery: Story = {};

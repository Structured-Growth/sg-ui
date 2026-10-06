# Persisted view state

`usePersistentState(key, initialValue, options)` preserves the existing local JSON
format by default. Use a distinct key for each page/view. The hook stores UI
preferences; the host owns credentials, sessions and application data.

`options.storage` selects `local`, `session` or `false`. Storage-disabled instances
are independent even when keys match. Local/session instances share their own
storage namespace. Blocked reads, quota failures and serialization errors retain
updates in browser-scoped memory and notify other mounted views using the same key.
No browser storage or request-shared fallback state is read during SSR.

Provide `validate` for structured view state. Stored JSON is untrusted: malformed
JSON, rejected values or a failed migration return a stable initial snapshot.
Functional setters receive the validated current snapshot, including the memory
fallback. Invalid writes fail validation rather than entering storage.

Set `version` to use `{__sguiPersistent:true, version, value}`. A different or
missing version requires an explicit `migrate(value, previousVersion)` returning a
valid current value. Returning undefined rejects the old state. Reading does not
silently rewrite storage; the next successful setter writes the current version.
Without a version option, existing raw values remain compatible.

Changing the key or storage namespace reads the new view immediately and uses its
new initial default. Changing `initialValue` alone does not reset an existing view.
Reset an existing view by setting its defaults explicitly. Cross-tab updates and
storage clearing invalidate cached/fallback snapshots. Memory fallbacks survive
view unmounting within this browser window and end when the window is discarded
or a matching storage update replaces them.

The legacy pagination helper still has its old size policy and will receive an
owned configurable policy during H-15. Its stored shape must be validated before
normalizing page/page-size values. The new grid's persistence remains opt-in and
will use versioned owned state rather than engine-specific models.

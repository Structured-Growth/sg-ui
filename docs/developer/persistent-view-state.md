# Persisted view state

`usePersistentState(key, initialValue, options)` uses raw JSON when no version is configured. Use a distinct key for each page/view. The hook stores UI
preferences; the host owns credentials, sessions and application data.

`options.storage` selects `local`, `session` or `false`. Storage-disabled instances
are independent even when keys match. Local/session instances share their own
storage namespace. Blocked reads, quota failures and serialization errors retain
updates in browser-scoped memory and notify other mounted views using the same key.
No browser storage or request-shared fallback state is read during SSR.

Provide `validate` for structured view state. Stored JSON is untrusted: malformed
JSON, rejected values or a mismatched version return a stable initial snapshot.
Functional setters receive the validated current snapshot, including the memory
fallback. Invalid writes fail validation rather than entering storage.

Set `version` to use `{__sguiPersistent:true, version, value}`. A different or
missing version returns the initial value. The hook has no migration callback.
Reading does not rewrite storage; a successful setter writes the configured
format and version. Hosts handle any application-owned data conversion outside
the library before mounting a view.

Changing the key or storage namespace reads the new view immediately and uses its
new initial default. Changing `initialValue` alone does not reset an existing view.
Reset an existing view by setting its defaults explicitly. Cross-tab updates and
storage clearing invalidate cached/fallback snapshots. Memory fallbacks survive
view unmounting within this browser window and end when the window is discarded
or a matching storage update replaces them.

`usePersistentPaginationModel` validates stored page/size shapes and applies the
configured size options. Grid persistence is opt-in and reads only its version-1
owned envelope at `sgui:grid:<view-key>:v1`; reset clears only that view's key.

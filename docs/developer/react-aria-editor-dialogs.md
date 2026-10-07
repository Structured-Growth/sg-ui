# Owned editor dialogs

Task references: M-31, M-32, M-33. ColumnsLayoutModal, ImageUploadModal and
LinkUrlModal retain their public names and now compose AppModal and owned controls.
Import `/styles.css` and provide `Provider` or `ThemeScope`, including when these
dialogs are opened from a legacy editor. Granular `/components/<name>` imports do
not pull in the legacy foundation or Lexical. These components never fetch URLs,
upload files, create assets or persist editor content; those operations belong to
the host.

## ColumnsLayoutModal

`open`, `onClose()`, `onSubmit(preset)` and `defaultPreset` remain available. The
five preset IDs remain unchanged. A labelled RadioGroup now exposes one selected
choice with arrow-key navigation. Insert commits the selected ID once per press;
Cancel/Escape never commit. Each opening restores `defaultPreset`, and changing
that prop while open reloads the draft. Invalid runtime IDs fall back to twoEqual.
The previous implementation retained a cancelled draft across reopening; hosts
should retain committed state and pass it back as `defaultPreset`.

## LinkUrlModal

`onSubmit({ displayText, url })` receives trimmed display text and the accepted,
trimmed URL spelling. A blank URL produces `null`, which the editor uses to remove
an existing link while preserving its text. URL-field Enter and Apply use the same
validation and commit path. Invalid input stays open with an associated field error
and URL focus. Changing initial values or reopening resets the draft. A committed
draft cannot be submitted again until it changes or the dialog opens again.

The new `allowedProtocols` policy accepts a subset of `http`, `https`, `mailto`
and `tel`; all four are enabled by default. `allowRelativeUrls` defaults to true
for root/document paths, queries and fragments. `www.` forms require HTTPS to be
allowed and remain unchanged in the callback; the editor's existing host boundary
normalizes them to HTTPS. Protocol-relative `//` URLs, executable/unknown schemes,
control characters, internal ASCII whitespace, backslashes, malformed HTTP(S)
and empty mailto/tel destinations are rejected. This intentionally changes the
previous unchecked acceptance behavior. Validation does not assert that a URL is
reachable or authorized; the host must also validate any externally supplied data
before rendering or persisting links.

## ImageUploadModal

The existing file-only contract remains `onSubmit(file)`, and `uploading`,
`errorMessage`, `title`, `open` and `onClose` remain available. `enableAltText`
defaults to false. When enabled, a labelled description field extends submission
to `onSubmit(file, altText)`, where the description is trimmed and an empty string
explicitly describes a decorative image. The integrated editor enables this field
and stores the supplied description on the Lexical image node; it preserves empty
strings instead of replacing them with the filename. Legacy file-only callers
continue receiving exactly one argument. Host asset upload callbacks remain File
based; asset metadata and persistent storage remain host-owned.

Insert and file selection are disabled during `uploading` or the returned promise.
A ref also prevents duplicate activation before the pending render. A rejected
callback reports a translated error and retains the selection for retry; a supplied
host error is displayed verbatim. Cancellation clears the selected file, native
input and description. The host must abort or ignore its own in-flight operations
on cancellation; dismissing a dialog does not cancel network work or undo persistence.

Selected images get a local object URL preview, revoked on replacement, dismissal
or unmount. Non-image drops are rejected using MIME type or a supported filename
extension when MIME is absent. This is presentation validation; the upload service
must inspect the actual contents and enforce its own type, size and asset policy.
The integrated editor ignores late upload success/error after cancellation,
reopening or unmount, so it cannot insert a stale image or close the next dialog.
The host upload itself may still finish and owns any cleanup of created assets.
The integrated editor also validates returned image addresses before insertion;
unsupported addresses report an error and retain the file/description for retry.
See the [image source policy](react-aria-editor-section.md#image-source-policy-e-06e-07-partial).

Existing-link editing now replaces child text atomically and selects the new text.
Calling Lexical's clear on a LinkNode removed the link itself when its last child
was deleted, causing edits to be silently discarded. Removing a link similarly
selects its replacement plain text so Lexical retains a valid selection. Relative
links keep no external target/rel; www links retain existing HTTPS normalization
and external target/rel behavior. These repairs preserve the editor's host JSON
change and asset models; they do not migrate the surrounding editor implementation.

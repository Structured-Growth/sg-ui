# Surveys, conversations and video

SGUI provides general interactive content components, independent of courses,
phishing scenarios, application transport or a learning management system.
Load the stylesheet and provide Provider/ThemeScope. Public components and owned
props are available from the root, components barrel and individual component
subpaths. No new runtime dependencies are required.

## Surveys

Survey renders a form containing direct SurveyQuestion children. Each question
has a stable ID and a host-controlled answer. `mode="one"` retains mounted
questions while showing one panel; `mode="all"` shows them together. `allowBack`
controls Back availability. Next validates the current question; Submit validates
the complete set and returns to an invalid hidden question. Navigation is either
internal or host-controlled through currentQuestionId/onQuestionChange. Accepted
navigation focuses the destination panel. Progress describes position, not answers.

SurveyQuestion supplies a semantic fieldset/legend, description, required state,
validation and optional feedback. Single/multiple/text/rating kinds compose owned
RadioGroup, Checkbox, TextArea and Rating; custom children provide their own native
labels, constraints and read-only policy. Multiple choice requires at least one
available answer, rather than every checkbox. Controlled values are strings,
string arrays, numbers or null. Keep IDs unique within a survey and keep required
choices available. Host-owned invalid state can also block navigation/submission.

AnswerFeedback displays an optional status/explanation. The host supplies its
meaning and decides when to reveal it; it does not score responses or replace
associated field errors. Survey callbacks do not imply durable submission.
Applications own conditional question lists, answers, scoring if wanted,
submission/pending/error state, reset, translations and persistence. Avoid nested
forms; use a standalone Survey or put SurveyQuestion in an existing host form.

## Text conversations

TextConversation accepts controlled messages with stable IDs, author, literal
text, incoming/outgoing/system direction and optional host-formatted time/status.
It exposes a keyboard-scrollable live log, a multiline draft and a Send action.
Enter in the textarea inserts a newline. Empty drafts cannot send. The log follows
new content only when already near the bottom; it does not steal focus.

onSend may return a promise. While awaiting acceptance, duplicate sends are blocked.
Resolve to clear an unchanged draft; reject to retain it and expose a retryable
error. draft/onDraftChange optionally controls the composer; readOnly removes it.
The host owns inserting accepted messages, delivery status, replies, transport,
phone/SMS integrations, history loading and storage. Docs replies are local scripts.

## Video

VideoPlayer forwards a native video ref, retains native controls and supports
caption/subtitle/description tracks, a transcript, metadata preload, inline
playback, poster, playback speeds and media failure reporting. No autoplay is
requested. Accessible media assets and equivalent access remain host obligations.
Native description-track and device behavior require target-platform verification.

seekPolicy is free, watched (replay recorded ranges) or none. Restricted seeks
restore the last accepted position and announce the limit. Merged watched intervals
prevent replay from inflating coverage; implausible timestamp jumps are excluded.
Viewing seconds measure observed active playback in the mounted session, separately
from media coverage. Completion combines requiredWatchPercent (default 100) with
minimumViewingSeconds (default 0); onComplete fires once per source session.
Changing src resets the session; changing default progress for the same source
requires a fresh React key. onProgress returns snapshots for host storage.

pauseWhenHidden optionally pauses without automatically resuming. Hosts supply
media delivery, authorization, validated resume data and content versions. Browser
playback evidence is not proof of attention or a server security boundary. The
player has no network persistence, question engine or streaming-provider SDK.
The docs include an original six-second silent WebM and WebVTT transcript/captions;
consumer snippets must substitute host-owned media URLs.

## Baseline validation

Colocated smoke tests cover sequential/all question validation, answer retention,
controlled navigation, multiple-choice form values, custom feedback, read-only
answers, send acceptance/failure/retry, read-only transcripts, coverage/seek limits,
completion and changed-source reset. Docs browser scenarios cover the primary flows,
example independence and public snippet compilation. These do not establish manual
screen-reader/device, all-browser or full acceptance gates.

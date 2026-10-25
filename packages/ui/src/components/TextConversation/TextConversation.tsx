"use client";
import {forwardRef, useEffect, useId, useRef, useState, type CSSProperties} from "react";
import {Button} from "../Button/Button";
import {TextArea} from "../../experimental/TextArea/TextArea";
import {Surface} from "../../experimental/Surface/Surface";
import {Typography} from "../../experimental/Typography/Typography";
import {useTranslation} from "../../i18n";
import styles from "./TextConversation.module.css";
export interface ConversationMessage {
  id: string;
  author: string;
  text: string;
  direction: "incoming" | "outgoing" | "system";
  /** Already formatted by the host for the intended locale/time zone. */
  timeLabel?: string;
  status?: string;
}
export interface TextConversationProps {
  title: string;
  messages: readonly ConversationMessage[];
  /** Resolve after accepting a message; reject to retain its draft and show an error. */
  onSend: (text: string) => void | Promise<void>;
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (draft: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  sending?: boolean;
  typingLabel?: string;
  emptyMessage?: string;
  errorMessage?: string;
  composerLabel?: string;
  sendLabel?: string;
  maxLength?: number;
  className?: string;
  style?: CSSProperties;
}
export const TextConversation = forwardRef<HTMLElement, TextConversationProps>(function TextConversation({title, messages, onSend, draft, defaultDraft = "", onDraftChange, disabled, readOnly, sending, typingLabel, emptyMessage, errorMessage, composerLabel, sendLabel, maxLength, className, style}, ref) {
  const {t} = useTranslation();
  const id = useId();
  const [internalDraft, setInternalDraft] = useState(defaultDraft);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const currentDraft = draft ?? internalDraft;
  const latestDraft = useRef(currentDraft);
  latestDraft.current = currentDraft;
  const inFlight = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const log = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  useEffect(() => {
    if (pinned.current && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, typingLabel]);
  const change = (next: string) => {
    if (draft === undefined) setInternalDraft(next);
    onDraftChange?.(next);
  };
  const send = async () => {
    if (inFlight.current || disabled || readOnly || sending || !currentDraft.trim()) return;
    inFlight.current = true;
    setPending(true); setFailed(false);
    const submittedDraft = currentDraft;
    try {
      await onSend(submittedDraft.trim());
      if (mounted.current && latestDraft.current === submittedDraft) change("");
    } catch {
      if (mounted.current) setFailed(true);
    } finally {
      inFlight.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return <section ref={ref} aria-labelledby={`${id}-title`} style={style} className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="text-conversation">
    <Typography id={`${id}-title`} as="h2" variant="h5">{title}</Typography>
    <div ref={log} role="log" aria-label={title} aria-live="polite" aria-relevant="additions text" tabIndex={0} className={styles.log}
      onScroll={() => { const node = log.current; if (node) pinned.current = node.scrollHeight - node.scrollTop - node.clientHeight < 32; }}>
      {messages.length === 0 && <Typography tone="muted">{emptyMessage ?? t("conversation.empty", {defaultMessage: "No messages yet."})}</Typography>}
      {messages.map(message => <Surface key={message.id} variant="outlined" tone={message.direction === "incoming" ? "subtle" : "default"} padding={3} className={styles.message} data-direction={message.direction}>
        <Typography variant="subtitle2">{message.author}</Typography>
        <Typography className={styles.text}>{message.text}</Typography>
        {(message.timeLabel || message.status) && <Typography variant="caption" tone="muted">{[message.timeLabel, message.status].filter(Boolean).join(" · ")}</Typography>}
      </Surface>)}
    </div>
    {typingLabel && <Typography role="status" variant="body2" tone="muted">{typingLabel}</Typography>}
    {(errorMessage || failed) && <Typography role="alert" tone="danger">{errorMessage ?? t("conversation.failed", {defaultMessage: "Message could not be sent. Your draft is still available; try again."})}</Typography>}
    {!readOnly && <form className={styles.composer} onSubmit={event => {event.preventDefault(); void send();}}>
      <TextArea label={composerLabel ?? t("conversation.message", {defaultMessage: "Message"})} rows={2} value={currentDraft} maxLength={maxLength} onValueChange={change} disabled={disabled || pending || sending}/>
      <Button type="submit" disabled={disabled || !currentDraft.trim()} loading={pending || sending}>{sendLabel ?? t("conversation.send", {defaultMessage: "Send"})}</Button>
    </form>}
  </section>;
});

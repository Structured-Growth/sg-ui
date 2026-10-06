"use client";

import { useEffect, useRef, useState } from "react";
import { AppModal } from "../AppModal";
import { TextField } from "../../experimental/TextField/TextField";
import { useTranslation } from "../../i18n";
import styles from "./LinkUrlModal.module.css";

export type LinkUrlModalProps = {
  open: boolean;
  initialDisplayText?: string;
  initialUrl?: string;
  onClose: () => void;
  onSubmit: (payload: { displayText: string; url: string | null }) => void;
  title?: string;
  /** Safe schemes accepted by the dialog. Defaults to HTTP, HTTPS, mailto and tel. */
  allowedProtocols?: readonly ("http" | "https" | "mailto" | "tel")[];
  /** Accept document-relative and root-relative paths. Defaults to true. */
  allowRelativeUrls?: boolean;
};

const defaultProtocols = ["http", "https", "mailto", "tel"] as const;

function isAcceptedUrl(value: string, protocols: LinkUrlModalProps["allowedProtocols"], allowRelative: boolean) {
  // Reject characters that browsers may strip or reinterpret before identifying a scheme.
  if (/[\u0000-\u0020\u007f\\]/.test(value) || value.startsWith("//")) return false;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(value)?.[1]?.toLowerCase();
  if (scheme && (!defaultProtocols.some(protocol => protocol === scheme) || !protocols?.some(protocol => protocol === scheme))) return false;
  if (!scheme && !value.startsWith("www.") && !allowRelative) return false;
  if (value.startsWith("www.") && !protocols?.includes("https")) return false;
  try {
    const parsed = new URL(value.startsWith("www.") ? `https://${value}` : value, "https://sgui.invalid/");
    if (scheme === "http" || scheme === "https") return /^https?:\/\//i.test(value) && Boolean(parsed.hostname);
    if (scheme === "mailto" || scheme === "tel") return parsed.pathname.length > 0;
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function LinkUrlModal({ open, initialDisplayText = "", initialUrl = "", onClose, onSubmit,
  title, allowedProtocols = defaultProtocols, allowRelativeUrls = true }: LinkUrlModalProps) {
  const { t } = useTranslation();
  const [displayText, setDisplayText] = useState(initialDisplayText);
  const [url, setUrl] = useState(initialUrl);
  const [invalid, setInvalid] = useState(false);
  const submitted = useRef(false);
  const urlInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDisplayText(initialDisplayText);
      setUrl(initialUrl);
      setInvalid(false);
      submitted.current = false;
    }
  }, [open, initialDisplayText, initialUrl]);

  const apply = () => {
    if (submitted.current) return;
    const trimmed = url.trim();
    if (trimmed && !isAcceptedUrl(trimmed, allowedProtocols, allowRelativeUrls)) {
      setInvalid(true);
      urlInput.current?.focus();
      return;
    }
    submitted.current = true;
    onSubmit({ displayText: displayText.trim(), url: trimmed || null });
  };

  return <AppModal size="xs" open={open} onClose={onClose}
    title={title ?? t("common.ui.insertLink", { defaultMessage: "Insert Link" })}
    primaryAction={{ label: t("common.ui.apply", { defaultMessage: "Apply" }), onPress: apply }}
    secondaryAction={{ tone: "neutral", label: t("common.ui.cancel", { defaultMessage: "Cancel" }), onPress: onClose, variant: "text" }}>
    <div className={styles.fields} onKeyDown={event => {
      if (event.key === "Enter" && event.target === urlInput.current && !event.nativeEvent.isComposing) {
        event.preventDefault();
        apply();
      }
    }}>
      <TextField autoFocus label={t("common.ui.linkDisplayText", { defaultMessage: "Display Text" })}
        value={displayText} onValueChange={value => { setDisplayText(value); submitted.current = false; }} />
      <TextField ref={urlInput} label={t("common.ui.linkUrl", { defaultMessage: "URL" })} value={url}
        placeholder="https://example.com" invalid={invalid}
        errorMessage={t("common.ui.invalidLinkUrl", { defaultMessage: "Enter a valid URL using an allowed protocol or a relative path." })}
        onValueChange={value => { setUrl(value); setInvalid(false); submitted.current = false; }} />
    </div>
  </AppModal>;
}

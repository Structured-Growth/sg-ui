"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { AppButton } from "../AppButton";
import { AppModal } from "../AppModal";
import { TextField } from "../../experimental/TextField/TextField";
import { Typography } from "../../experimental/Typography/Typography";
import { UploadFileIcon } from "../../experimental/icons/UploadFileIcon";
import { useTranslation } from "../../i18n";
import styles from "./ImageUploadModal.module.css";

export type ImageUploadModalProps = {
  open: boolean;
  uploading?: boolean;
  errorMessage?: string | null;
  title?: string;
  onClose: () => void;
  onSubmit: (file: File, altText?: string) => Promise<void> | void;
  /** Enables the image description field.
   * The host must upload the File and persist/use altText when inserting the image.
   * An empty description identifies a decorative image. */
  enableAltText?: boolean;
};

export function ImageUploadModal({ open, uploading = false, errorMessage = null, title,
  onClose, onSubmit, enableAltText = false }: ImageUploadModalProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [invalidFile, setInvalidFile] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitting = useRef<number | null>(null);
  const session = useRef(0);
  const busy = uploading || pending;
  const reset = () => {
    session.current += 1;
    setSelectedFile(null); setAltText(""); setFailed(false); setInvalidFile(false);
    submitting.current = null; setPending(false);
    if (inputRef.current) inputRef.current.value = "";
  };
  useEffect(() => { if (!open) reset(); }, [open]);
  useEffect(() => {
    if (!selectedFile || typeof URL.createObjectURL !== "function") { setPreview(null); return; }
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => { if (typeof URL.revokeObjectURL === "function") URL.revokeObjectURL(url); };
  }, [selectedFile]);
  const close = () => { reset(); onClose(); };
  const select = (file: File | null) => {
    if (busy) return;
    if (file && !(file.type.startsWith("image/") || (!file.type && /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name)))) {
      setSelectedFile(null); setInvalidFile(true); setFailed(false);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setSelectedFile(file); setFailed(false); setInvalidFile(false);
  };
  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) select(file);
  };
  const submit = async () => {
    if (!selectedFile || busy || submitting.current !== null) return;
    const currentSession = session.current;
    submitting.current = currentSession; setPending(true); setFailed(false);
    try {
      if (enableAltText) await onSubmit(selectedFile, altText.trim());
      else await onSubmit(selectedFile);
      // Keep selection until host dismissal so host-reported upload failures remain retryable.
    } catch {
      if (session.current === currentSession) setFailed(true);
    } finally {
      if (session.current === currentSession) { submitting.current = null; setPending(false); }
    }
  };

  return <AppModal size="sm" onClose={close} open={open}
    title={title ?? t("common.ui.insertImage", { defaultMessage: "Insert Image" })}
    primaryAction={{ disabled: busy || !selectedFile,
      label: busy ? t("common.ui.uploadingImage", { defaultMessage: "Uploading..." }) : t("common.ui.insert", { defaultMessage: "Insert" }),
      onPress: submit }}
    secondaryAction={{ tone: "neutral", label: t("common.ui.cancel", { defaultMessage: "Cancel" }), onPress: close, variant: "text" }}>
    <div className={styles.root} data-sgui-part="image-upload">
      <div className={styles.dropZone} onDrop={onDrop} onDragOver={event => event.preventDefault()}>
        <UploadFileIcon size="2em" className={styles.icon} />
        <Typography variant="body2">{t("common.ui.imageDropHint", { defaultMessage: "Drag and drop an image here" })}</Typography>
        <AppButton onPress={() => inputRef.current?.click()} density="compact" variant="outlined" disabled={busy}>
          {t("common.ui.searchFiles", { defaultMessage: "Search Files" })}
        </AppButton>
        <Typography tone="muted" variant="caption">{t("common.ui.imageFormats", { defaultMessage: "JPG, PNG, WEBP, AVIF, or GIF" })}</Typography>
        <input accept="image/*" hidden aria-label={t("common.ui.chooseImage", { defaultMessage: "Choose image" })}
          disabled={busy} onChange={event => select(event.target.files?.[0] ?? null)} ref={inputRef} type="file" />
      </div>
      {selectedFile && <div className={styles.selection} role="status">
        {preview && <img className={styles.preview} src={preview} alt={enableAltText ? altText : selectedFile.name} />}
        <Typography variant="body2">{selectedFile.name}</Typography>
        <Typography tone="muted" variant="caption">{t("common.ui.imageFileSize", {
          defaultMessage: "{size} KB", values: { size: (selectedFile.size / 1024).toFixed(1) },
        })}</Typography>
      </div>}
      {enableAltText && <TextField label={t("common.ui.imageDescription", { defaultMessage: "Image description" })}
        description={t("common.ui.imageDescriptionHint", { defaultMessage: "Describe the image for readers who cannot see it. Leave empty for a decorative image." })}
        value={altText} onValueChange={setAltText} disabled={busy} />}
      {(errorMessage || failed || invalidFile) && <Typography role="alert" tone="danger" variant="body2">
        {errorMessage || (invalidFile ? t("common.ui.imageFileRequired", { defaultMessage: "Choose an image file." }) : t("common.ui.imageUploadFailed", { defaultMessage: "Image upload failed. Try again." }))}
      </Typography>}
    </div>
  </AppModal>;
}

"use client";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "../../experimental/IconButton/IconButton";
import { TextField } from "../../experimental/TextField/TextField";
import { Typography } from "../../experimental/Typography/Typography";
import { EditIcon } from "../../experimental/icons/EditIcon";
import { useTranslation } from "../../i18n";
import styles from "./EditableTitleField.module.css";

export type EditableTitleFieldProps = {
  title: string;
  placeholder?: string;
  onSave: (nextTitle: string) => Promise<void> | void;
  variant?: "h4" | "h5" | "h6";
  minWidth?: number;
  readOnly?: boolean;
};

export function EditableTitleField({ title, placeholder, onSave, variant = "h4", minWidth = 280, readOnly = false }: EditableTitleFieldProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const editing = useRef(false);
  const saving = useRef(false);
  const session = useRef(0);
  const restoreFocus = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (!isEditing && restoreFocus.current) {
      editButton.current?.focus();
      restoreFocus.current = false;
    }
  }, [isEditing]);

  const enterEditMode = () => {
    if (saving.current || readOnly || editing.current) return;
    session.current += 1;
    editing.current = true;
    setDraft(title);
    setFailed(false);
    setIsEditing(true);
  };
  const finish = (focus: boolean) => {
    editing.current = false;
    restoreFocus.current = focus;
    setIsEditing(false);
  };
  const save = async () => {
    if (!editing.current || saving.current || readOnly) return;
    const next = draft.trim();
    if (!next || next === title) {
      setDraft(title);
      finish(input.current === input.current?.ownerDocument.activeElement);
      return;
    }
    const currentSession = session.current;
    saving.current = true;
    setIsSaving(true);
    setFailed(false);
    try {
      await onSave(next);
      if (mounted.current && currentSession === session.current) finish(input.current === input.current?.ownerDocument.activeElement);
    } catch {
      if (mounted.current && currentSession === session.current) setFailed(true);
    } finally {
      saving.current = false;
      if (mounted.current) setIsSaving(false);
    }
  };

  return <div className={styles.root} style={{ minWidth }} data-read-only={readOnly || undefined} data-sgui-part="editable-title"
    onClick={() => { if (!isEditing) enterEditMode(); }}
    onDoubleClick={() => { if (!isEditing) enterEditMode(); }}
    onKeyDown={(event) => {
      if (!isEditing || event.target !== input.current || event.nativeEvent.isComposing) return;
      if (event.key === "Enter") {
        event.preventDefault(); event.stopPropagation(); void save();
      } else if (event.key === "Escape") {
        event.preventDefault(); event.stopPropagation(); session.current += 1;
        setDraft(title); setFailed(false); finish(true);
      }
    }}>
    {isEditing ? <TextField ref={input} autoFocus density="compact" className={styles.field}
      aria-label={t("common.ui.documentTitle", { defaultMessage: "Document title" })}
      onBlur={() => { void save(); }}
      onValueChange={(value) => { setDraft(value); setFailed(false); }}
      readOnly={isSaving || readOnly} value={draft} invalid={failed}
      errorMessage={failed ? t("common.ui.titleSaveFailed", { defaultMessage: "Could not save title. Try again." }) : undefined}
      description={isSaving ? t("common.ui.savingTitle", { defaultMessage: "Saving title…" }) : undefined} /> : <>
      <Typography as={variant} variant={variant}>{title || placeholder || t("common.ui.untitledDocument", { defaultMessage: "Untitled document" })}</Typography>
      <IconButton ref={editButton} className={styles.edit} disabled={readOnly} loading={isSaving} density="compact"
        label={t("common.ui.editTitle", { defaultMessage: "Edit title" })} onPress={enterEditMode}><EditIcon /></IconButton>
    </>}
  </div>;
}

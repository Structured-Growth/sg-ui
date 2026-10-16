export interface TimeFieldProps {
  label: string;
  /** Textbox with optional selection popup by default; segments retains native segmented entry. */
  entryMode?: "text" | "segments";
  /** Local clock time HH:mm:ss; this is not an instant. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Minute choices in text-mode popup, 1–60. Existing non-step minutes remain editable. This is a suggestion increment, not a rounding rule. */
  minuteStep?: number;
  /** Return an unavailable reason for a canonical HH:mm:ss time. The host can close over the selected date. */
  getTimeUnavailableReason?: (time:string) => string | undefined;
  min?: string;
  max?: string;
  name?: string;
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hourCycle?: 12 | 24;
  /** Reports complete, valid clock entry, including partial segment edits. */
  onValidityChange?: (valid: boolean) => void;
}

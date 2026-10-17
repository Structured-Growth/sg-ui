import type {FieldMessagePlacementProps} from "../TextField/FieldMessages";
export interface DateFieldProps extends FieldMessagePlacementProps {
  label: string;
  /** Date-only text accepts ISO, locale-ordered numeric dates and named months; normalizes on blur/Enter. Two-digit years use the fixed 1950–2049 window. */
  entryMode?: "segments" | "text";
  /** Host-supplied YYYY-MM-DD anchor for relative text. No implicit clock; omit to disable relative phrases. */
  referenceDate?: string;
  /** Reports entry validity so a composed workflow can guard its commit action. */
  onValidityChange?: (valid: boolean) => void;
  /** date: YYYY-MM-DD; datetime: YYYY-MM-DDTHH:mm:ss without timezone. */
  kind?: "date" | "datetime";
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  min?: string;
  max?: string;
  name?: string;
  /** Optional host help text. No automatic format instructions are shown. */
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hourCycle?: 12 | 24;
}

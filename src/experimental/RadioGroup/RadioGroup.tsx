"use client";
import { forwardRef, useContext, useEffect, useId, useLayoutEffect, useRef, type CSSProperties } from "react";
import { RadioGroup as AriaRadioGroup, Radio, RadioGroupStateContext } from "react-aria-components/RadioGroup";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import styles from "./RadioGroup.module.css";
const useOptionsLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;
export interface RadioOption { value: string; label: string; disabled?: boolean; }
export interface RadioGroupProps {
  label: string;
  options: readonly RadioOption[];
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  description?: string;
  errorMessage?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
}
function RadioOptions({ options, orientation, name }: { options: readonly RadioOption[]; orientation: "horizontal" | "vertical"; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useContext(RadioGroupStateContext);
  useOptionsLayoutEffect(() => {
    const radios = Array.from(ref.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []);
    radios.forEach(input => {
      // WebKit skips the entire named group when its checked radio is disabled,
      // even if an enabled sibling has tabindex=0. A disabled selection stays
      // checked/host-owned but cannot participate in native grouping or validity.
      if (input.disabled && input.checked) {
        input.removeAttribute("name");
      } else {
        // The owned current name also restores grouping after enabling. React
        // Aria's internal generated-name seed need not follow host name updates.
        input.name = name;
      }
    });
    const inputs = radios.filter(input => !input.disabled);
    // React Aria's roving entry follows the selected value even when its option
    // disappears or becomes disabled. Repair only native Tab entry; do not select
    // a replacement, emit a host callback or move focus during collection changes.
    if (inputs.some(input => input.checked)) return;
    const entry = inputs.find(input => input.value === state?.lastFocusedValue) ?? inputs[0];
    inputs.forEach(input => { input.tabIndex = input === entry ? 0 : -1; });
  });
  return <div ref={ref} className={styles.options} data-orientation={orientation}>
    {options.map(option => <Radio key={option.value} value={option.value} isDisabled={option.disabled} className={styles.radio}><span aria-hidden="true" className={styles.indicator} />{option.label}</Radio>)}
  </div>;
}
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup({ label, options, value, defaultValue, onValueChange, disabled, readOnly, required, invalid, name, description, errorMessage, orientation = "vertical", className, style }, ref) {
  const generatedName = useId();
  const formName = name ?? generatedName;
  return <AriaRadioGroup ref={ref} value={value} defaultValue={defaultValue} onChange={onValueChange} isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={invalid} name={formName} orientation={orientation}
    validationBehavior="native" className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
    <Label className={styles.label}>{label}</Label><RadioOptions options={options} orientation={orientation} name={formName} />
    {description && <Text slot="description" className={styles.description}>{description}</Text>}<FieldError className={styles.error}>{errorMessage}</FieldError>
  </AriaRadioGroup>;
});

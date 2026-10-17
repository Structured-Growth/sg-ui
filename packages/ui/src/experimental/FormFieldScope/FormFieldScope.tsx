"use client";

import {createContext, useContext, type ReactNode} from "react";

/** Presentation defaults shared by supported form fields. */
export interface FieldMessagePlacementProps {
  /** Description position relative to the control. Inherits the nearest FormFieldScope; otherwise above, after a separate label. */
  descriptionPlacement?: "above" | "below";
  /** Validation position relative to the control. Inherits the nearest FormFieldScope; otherwise below. Above follows any above-control description. */
  errorPlacement?: "above" | "below";
}

export interface FormFieldScopeProps extends FieldMessagePlacementProps {
  /** Fields and layout receiving these defaults. No DOM element or native form is created. */
  children?: ReactNode;
}

const FieldDefaultsContext = createContext<Required<FieldMessagePlacementProps>>({
  descriptionPlacement: "above",
  errorPlacement: "below",
});

/** Supplies inheritable message placement only; individual field props win. */
export function FormFieldScope({children, descriptionPlacement, errorPlacement}: FormFieldScopeProps) {
  const parent = useContext(FieldDefaultsContext);
  return <FieldDefaultsContext.Provider value={{
    descriptionPlacement: descriptionPlacement ?? parent.descriptionPlacement,
    errorPlacement: errorPlacement ?? parent.errorPlacement,
  }}>{children}</FieldDefaultsContext.Provider>;
}

/** Internal resolver; undefined inherits and explicit field settings take precedence. */
export function useFieldMessagePlacement(props: FieldMessagePlacementProps) {
  const defaults = useContext(FieldDefaultsContext);
  return {
    descriptionPlacement: props.descriptionPlacement ?? defaults.descriptionPlacement,
    errorPlacement: props.errorPlacement ?? defaults.errorPlacement,
  };
}

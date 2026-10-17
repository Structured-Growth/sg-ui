import type {ReactNode} from "react";

/** Shared owned placement contract for field guidance and validation messages. */
export interface FieldMessagePlacementProps {
  /** Description position relative to the control. Defaults above, after the label where a separate label exists. */
  descriptionPlacement?: "above" | "below";
  /** Validation message position relative to the control. Defaults below; above follows any above-control description. */
  errorPlacement?: "above" | "below";
}

/** Keeps native message nodes/IDs/interaction contexts owned by their field. */
export function FieldMessages({position,descriptionPlacement="above",errorPlacement="below",description,error}:FieldMessagePlacementProps&{position:"above"|"below";description?:ReactNode;error?:ReactNode}) {
  return <>{descriptionPlacement===position&&description}{errorPlacement===position&&error}</>;
}

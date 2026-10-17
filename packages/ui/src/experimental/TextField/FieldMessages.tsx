"use client";

import type {ReactNode} from "react";
import {useFieldMessagePlacement, type FieldMessagePlacementProps} from "../FormFieldScope/FormFieldScope";
export type {FieldMessagePlacementProps} from "../FormFieldScope/FormFieldScope";

/** Keeps native message nodes/IDs/interaction contexts owned by their field. */
export function FieldMessages({position,descriptionPlacement,errorPlacement,description,error}:FieldMessagePlacementProps&{position:"above"|"below";description?:ReactNode;error?:ReactNode}) {
  const placement = useFieldMessagePlacement({descriptionPlacement,errorPlacement});
  return <>{placement.descriptionPlacement===position&&description}{placement.errorPlacement===position&&error}</>;
}

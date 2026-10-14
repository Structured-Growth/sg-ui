import { OwnedGridStatus, type OwnedGridStatusProps } from "../ownedGridParts";
export function TableNoResults(props: Omit<OwnedGridStatusProps, "state">) { return <OwnedGridStatus {...props} state="noResults" />; }

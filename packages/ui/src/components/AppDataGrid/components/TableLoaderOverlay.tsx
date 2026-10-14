import { OwnedGridStatus, type OwnedGridStatusProps } from "../ownedGridParts";
export function TableLoaderOverlay(props: Omit<OwnedGridStatusProps, "state">) { return <OwnedGridStatus {...props} state="loading" />; }

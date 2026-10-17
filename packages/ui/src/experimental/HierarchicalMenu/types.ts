import type { CSSProperties, ReactNode } from "react";
import type { Density } from "../../foundation/ThemeScope";

/** IDs must be unique across the sections and footer of each level. */
export interface HierarchicalMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  current?: boolean;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  replace?: boolean;
  children?: HierarchicalMenuLevel;
  /** Navigation can mix inline disclosures and drilldown. Commands always drill down. */
  childBehavior?: "drilldown" | "inline";
}
export interface HierarchicalMenuSection {
  id: string;
  label?: string;
  items: readonly HierarchicalMenuItem[];
}
export interface HierarchicalMenuLevel {
  title?: string;
  sections: readonly HierarchicalMenuSection[];
  footerItems?: readonly HierarchicalMenuItem[];
}
export interface HierarchicalMenuProps {
  label: string;
  /** Root content. Each level has its own unique item IDs, optional title/sections/footer. */
  items: HierarchicalMenuLevel;
  /** Navigation uses native links/buttons; commands uses an arrow-key menu collection. */
  presentation?: "navigation" | "commands";
  /** Controlled ancestry by item ID, including inline ancestors of a drilldown branch. */
  path?: readonly string[];
  /** Initial local ancestry on mount; later changes do not reset the local path. */
  defaultPath?: readonly string[];
  /** Requests accepted navigation or one correction to a removed/disabled ancestry. Hosts retain authority. */
  onPathChange?: (path: string[]) => void;
  /** Leaf notification only. A leaf href owns routing; do not navigate again here. */
  onAction?: (id: string) => void;
  /** Optional outer popup dismissal request on Escape at root; persistent navigation omits it. */
  onDismiss?: () => void;
  /** Defaults to translated "Back to {label}"; visible Back text uses the branch label. */
  backLabel?: (branchLabel: string) => string;
  density?: Density;
  className?: string;
  style?: CSSProperties;
}

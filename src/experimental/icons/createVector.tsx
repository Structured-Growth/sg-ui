import { forwardRef, type ComponentType, type CSSProperties, type SVGProps } from "react";
import styles from "./icons.module.css";
export interface IconProps {
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  fill?: string;
  /** Omit for a decorative icon. Name the containing action separately. */
  label?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  mirrorInRtl?: boolean;
}
export function createIcon(component: ComponentType<SVGProps<SVGSVGElement>>, name: string, directional = false) {
  const Vector = component;
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ size = "1em", strokeWidth = 2, color = "currentColor",
    fill = "none", label, className, mirrorInRtl = directional, ...props }, ref) {
    return <Vector {...props} ref={ref} width={size} height={size} strokeWidth={strokeWidth} color={color} fill={fill}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false"
      data-mirror-rtl={mirrorInRtl || undefined} className={[styles.root, className].filter(Boolean).join(" ")} />;
  });
  Icon.displayName = name;
  return Icon;
}

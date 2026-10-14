import type { CSSProperties, ReactNode } from "react";
import { Card } from "../../experimental/Card/Card";
import styles from "./ClassCardFrame.module.css";
export const STANDARD_CLASS_CARD_WIDTH = 420;
export const STANDARD_CLASS_CARD_MIN_WIDTH = 360;
export type ClassCardFrameProps = {
  header: ReactNode; body: ReactNode; footer?: ReactNode; width?: number;
  className?: string; style?: CSSProperties;
  headerClassName?: string; headerStyle?: CSSProperties;
  bodyClassName?: string; bodyStyle?: CSSProperties;
  footerClassName?: string; footerStyle?: CSSProperties;
};
export function ClassCardFrame({ header, body, footer, width = STANDARD_CLASS_CARD_WIDTH,
  className, style, headerClassName, headerStyle, bodyClassName, bodyStyle,
  footerClassName, footerStyle }: ClassCardFrameProps) {
  return <Card className={[styles.root, className].filter(Boolean).join(" ")}
    style={{ maxInlineSize: width, ...style }} data-sgui-part="class-card-frame">
    <div className={[styles.header, headerClassName].filter(Boolean).join(" ")} style={headerStyle} data-sgui-part="class-card-header">{header}</div>
    <div className={[styles.body, bodyClassName].filter(Boolean).join(" ")} style={bodyStyle} data-sgui-part="class-card-body">{body}</div>
    {footer ? <div className={[styles.footer, footerClassName].filter(Boolean).join(" ")} style={footerStyle} data-sgui-part="class-card-footer">{footer}</div> : null}
  </Card>;
}

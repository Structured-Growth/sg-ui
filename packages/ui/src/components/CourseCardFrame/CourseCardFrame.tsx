import type { CSSProperties, ReactNode } from "react";
import { Card } from "../../experimental/Card/Card";
import styles from "./CourseCardFrame.module.css";
export const STANDARD_COURSE_CARD_WIDTH = 420;
export const STANDARD_COURSE_CARD_MIN_WIDTH = 360;
export type CourseCardFrameProps = {
  header: ReactNode; body: ReactNode; footer?: ReactNode; width?: number;
  className?: string; style?: CSSProperties;
  headerClassName?: string; headerStyle?: CSSProperties;
  bodyClassName?: string; bodyStyle?: CSSProperties;
  footerClassName?: string; footerStyle?: CSSProperties;
};
export function CourseCardFrame({ header, body, footer, width = STANDARD_COURSE_CARD_WIDTH,
  className, style, headerClassName, headerStyle, bodyClassName, bodyStyle,
  footerClassName, footerStyle }: CourseCardFrameProps) {
  return <Card className={[styles.root, className].filter(Boolean).join(" ")}
    style={{ maxInlineSize: width, ...style }} data-sgui-part="course-card-frame">
    <div className={[styles.header, headerClassName].filter(Boolean).join(" ")} style={headerStyle} data-sgui-part="course-card-header">{header}</div>
    <div className={[styles.body, bodyClassName].filter(Boolean).join(" ")} style={bodyStyle} data-sgui-part="course-card-body">{body}</div>
    {footer ? <div className={[styles.footer, footerClassName].filter(Boolean).join(" ")} style={footerStyle} data-sgui-part="course-card-footer">{footer}</div> : null}
  </Card>;
}

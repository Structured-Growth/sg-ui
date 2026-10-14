"use client";

import { forwardRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Avatar.module.css";

export interface AvatarProps {
  /** Host-translated image name. Use an empty string for a decorative avatar. */
  alt: string;
  src?: string;
  fallback?: ReactNode;
  size?: "small" | "medium" | "large";
  shape?: "circle" | "square";
  id?: string;
  className?: string;
  style?: CSSProperties;
}

function Image({ src }: { src: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  return state === "error" ? null : <img src={src} alt="" aria-hidden="true"
    className={styles.image} data-loaded={state === "loaded" || undefined}
    onLoad={() => setState("loaded")} onError={() => setState("error")} />;
}

/** Fallback and image share a stable box and one host-owned accessible name. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { alt, src, fallback, size = "medium", shape = "circle", className, ...props }, ref,
) {
  return <span {...props} ref={ref} role={alt ? "img" : undefined} aria-label={alt || undefined}
    aria-hidden={alt ? undefined : true} data-size={size} data-shape={shape}
    data-sgui-part="avatar" className={[styles.root, className].filter(Boolean).join(" ")}>
    <span aria-hidden="true" className={styles.fallback}>{fallback}</span>
    {src && <Image key={src} src={src} />}
  </span>;
});

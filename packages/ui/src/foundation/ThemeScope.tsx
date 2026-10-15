"use client";

import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, type CSSProperties, type HTMLAttributes } from "react";
import styles from "./ThemeScope.module.css";
import { observeScrollbarActivity } from "./scrollbar-activity";

export type ColorTheme = "light" | "dark" | "system";
export type Density = "compact" | "comfortable";
/** Presentation policy; never disables mouse, touch, pen or keyboard interaction. */
export type InteractionMode = "auto" | "pointer" | "touch";
export type ScopeStyle = CSSProperties & Partial<Record<`--sgui-${string}`, string | number>>;
export interface ThemeScopeProps extends HTMLAttributes<HTMLDivElement> {
  theme?: ColorTheme;
  density?: Density;
  interactionMode?: InteractionMode;
  style?: ScopeStyle;
}

const ScopeContext = createContext<{ theme: ColorTheme; density: Density; interactionMode: InteractionMode; dir?: HTMLAttributes<HTMLDivElement>["dir"]; lang?: string; variables?: ScopeStyle }>({
  theme: "light", density: "comfortable", interactionMode: "auto",
});

/** A scoped visual root. System theme is resolved by CSS, never browser reads in render. */
export const ThemeScope = forwardRef<HTMLDivElement, ThemeScopeProps>(function ThemeScope(
  { theme, density, interactionMode, children, dir, lang, style, className, ...props }, ref,
) {
  const root = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => root.current!, []);
  useEffect(() => {
    if (root.current) return observeScrollbarActivity(root.current.ownerDocument);
  }, []);
  const parent = useContext(ScopeContext);
  const variables = { ...parent.variables, ...Object.fromEntries(Object.entries(style ?? {}).filter(([key]) => key.startsWith("--sgui-"))) };
  const value = { theme: theme ?? parent.theme, density: density ?? parent.density, interactionMode: interactionMode ?? parent.interactionMode, dir: dir ?? parent.dir, lang: lang ?? parent.lang, variables };
  return (
    <ScopeContext.Provider value={value}>
      <div {...props} ref={root} dir={value.dir} lang={value.lang} className={[styles.root, className].filter(Boolean).join(" ")} style={{ ...variables, ...style }} data-sgui-scope="" data-sgui-theme={value.theme} data-sgui-density={value.density} data-sgui-interaction={value.interactionMode}>
        {children}
      </div>
    </ScopeContext.Provider>
  );
});

/** Internal portal attributes. Layout styles never propagate to overlays. */
export function useOverlayScope() {
  const scope = useContext(ScopeContext);
  return { "data-sgui-scope": "", "data-sgui-theme": scope.theme, "data-sgui-density": scope.density, "data-sgui-interaction": scope.interactionMode,
    dir: scope.dir, lang: scope.lang, style: scope.variables };
}

/** Internal native bridge for overlays whose interaction engine replaces the visual dir prop.
 * Keep locale-driven interactions separate from the owned visual direction override.
 * Keep the ref stable during child updates so nested overlay focus is not reset.
 */
export function useOverlayDirectionRef(localeDirection: "ltr" | "rtl") {
  const { dir } = useContext(ScopeContext);
  return useCallback((element: HTMLElement | null) => {
    if (element) element.setAttribute("dir", dir ?? localeDirection);
  }, [dir, localeDirection]);
}

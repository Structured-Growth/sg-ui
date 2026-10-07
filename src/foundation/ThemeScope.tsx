"use client";

import { createContext, forwardRef, useContext, type CSSProperties, type HTMLAttributes } from "react";
import styles from "./ThemeScope.module.css";

export type ColorTheme = "light" | "dark" | "system";
export type Density = "compact" | "comfortable";
export type ScopeStyle = CSSProperties & Partial<Record<`--sgui-${string}`, string | number>>;
export interface ThemeScopeProps extends HTMLAttributes<HTMLDivElement> {
  theme?: ColorTheme;
  density?: Density;
  style?: ScopeStyle;
}

const ScopeContext = createContext<{ theme: ColorTheme; density: Density; dir?: HTMLAttributes<HTMLDivElement>["dir"]; lang?: string; variables?: ScopeStyle }>({
  theme: "light", density: "comfortable",
});

/** A scoped visual root. System theme is resolved by CSS, never browser reads in render. */
export const ThemeScope = forwardRef<HTMLDivElement, ThemeScopeProps>(function ThemeScope(
  { theme, density, children, dir, lang, style, className, ...props }, ref,
) {
  const parent = useContext(ScopeContext);
  const variables = { ...parent.variables, ...Object.fromEntries(Object.entries(style ?? {}).filter(([key]) => key.startsWith("--sgui-"))) };
  const value = { theme: theme ?? parent.theme, density: density ?? parent.density, dir: dir ?? parent.dir, lang: lang ?? parent.lang, variables };
  return (
    <ScopeContext.Provider value={value}>
      <div {...props} ref={ref} dir={value.dir} lang={value.lang} className={[styles.root, className].filter(Boolean).join(" ")} style={{ ...variables, ...style }} data-sgui-scope="" data-sgui-theme={value.theme} data-sgui-density={value.density}>
        {children}
      </div>
    </ScopeContext.Provider>
  );
});

/** Internal portal attributes. Layout styles never propagate to overlays. */
export function useOverlayScope() {
  const scope = useContext(ScopeContext);
  return { "data-sgui-scope": "", "data-sgui-theme": scope.theme, "data-sgui-density": scope.density,
    dir: scope.dir, lang: scope.lang, style: scope.variables };
}

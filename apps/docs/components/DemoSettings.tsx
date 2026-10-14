'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DemoIdentity, DemoMode, DemoContrast, ResolvedMode } from './demo-theme';
import { useMediaPreference } from './system-preferences';
type Settings = {
  mode: DemoMode; identity: DemoIdentity; contrast: DemoContrast;
  resolvedMode: ResolvedMode; resolvedContrast: 'standard' | 'increased'; forcedColors: boolean;
  setMode: (mode: DemoMode) => void; setIdentity: (identity: DemoIdentity) => void;
  setContrast: (contrast: DemoContrast) => void;
};
const DemoSettings = createContext<Settings | null>(null);
export function useDemoSettings() {
  const settings = useContext(DemoSettings);
  if (!settings) throw new Error('Component examples require DemoSettingsProvider.');
  return settings;
}
/** One layout-level owner. Client navigation preserves settings; reload starts fresh. */
export function DemoSettingsProvider({children}: {children:ReactNode}) {
  const [mode, setMode] = useState<DemoMode>('system');
  const [identity, setIdentity] = useState<DemoIdentity>('material');
  const [contrast, setContrast] = useState<DemoContrast>('system');
  const prefersDark = useMediaPreference('(prefers-color-scheme: dark)');
  const prefersMore = useMediaPreference('(prefers-contrast: more)');
  const forcedColors = useMediaPreference('(forced-colors: active)');
  const resolvedMode = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
  const resolvedContrast = forcedColors || contrast === 'increased' || (contrast === 'system' && prefersMore) ? 'increased' : 'standard';
  return <DemoSettings.Provider value={{mode, identity, contrast, resolvedMode, resolvedContrast, forcedColors, setMode, setIdentity, setContrast}}>{children}</DemoSettings.Provider>;
}

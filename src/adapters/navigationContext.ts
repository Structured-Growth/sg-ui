"use client";
import { createContext } from "react";
import type { SGNavigationAdapter } from "./navigation";

/** Null preserves native anchors when the host has not supplied routing. */
export const NavigationContext = createContext<SGNavigationAdapter | null>(null);

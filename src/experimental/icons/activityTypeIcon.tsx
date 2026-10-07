import type { ReactNode } from "react";
import { MenuBookOutlinedIcon } from "./MenuBookOutlinedIcon";
import { QuizOutlinedIcon } from "./QuizOutlinedIcon";
import { FactCheckOutlinedIcon } from "./FactCheckOutlinedIcon";
import { ScienceOutlinedIcon } from "./ScienceOutlinedIcon";
import { WorkOutlineOutlinedIcon } from "./WorkOutlineOutlinedIcon";
export interface ActivityIconOptions {
  size?: number | string;
  overrides?: Readonly<Record<string, ReactNode>>;
  fallback?: ReactNode;
}
export function getActivityTypeIcon(type: string | null | undefined, { size = 20, overrides, fallback }: ActivityIconOptions = {}): ReactNode {
  const key = (type ?? "").toLowerCase();
  if (overrides && Object.prototype.hasOwnProperty.call(overrides, key)) return overrides[key];
  switch (key) {
    case "lesson": return <MenuBookOutlinedIcon size={size} />;
    case "quiz": case "exam": return <QuizOutlinedIcon size={size} />;
    case "assignment": case "project": return <FactCheckOutlinedIcon size={size} />;
    case "lab": case "practice": return <ScienceOutlinedIcon size={size} />;
    default: return fallback !== undefined ? fallback : <WorkOutlineOutlinedIcon size={size} />;
  }
}

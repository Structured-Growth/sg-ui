"use client";

import { Progress } from "../../experimental/Progress/Progress";
import { Typography } from "../../experimental/Typography/Typography";
import { useTranslation } from "../../i18n";
import styles from "./AppInlineProgress.module.css";

export type AppInlineProgressProps = {
  value: number;
  barWidth?: number | string;
};

export function AppInlineProgress({ value, barWidth }: AppInlineProgressProps) {
  const { t } = useTranslation();
  const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
  return <div className={styles.root} data-sgui-part="inline-progress">
    <Progress className={styles.progress} value={normalizedValue}
      aria-label={t("common.ui.progress", { defaultMessage: "Progress" })}
      style={{ inlineSize: barWidth }} />
    <Typography as="span" variant="body2">{normalizedValue}%</Typography>
  </div>;
}

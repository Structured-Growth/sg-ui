"use client";

import { Progress } from "../../experimental/Progress/Progress";
import { Typography } from "../../experimental/Typography/Typography";
import { Surface } from "../../experimental/Surface/Surface";
import { CheckIcon } from "../../experimental/icons/CheckIcon";
import { CircleIcon } from "../../experimental/icons/CircleIcon";
import { useTranslation } from "../../i18n";
import styles from "./AppOperationSteps.module.css";

export type AppOperationStepStatus = "pending" | "in_progress" | "completed";
export type AppOperationStep = { id: string; label: string; status: AppOperationStepStatus };
export type AppOperationStepsProps = { title?: string; subtitle?: string; steps: AppOperationStep[] };

export function AppOperationSteps({ title, subtitle, steps }: AppOperationStepsProps) {
  const { t } = useTranslation();
  const labels: Record<AppOperationStepStatus, string> = {
    pending: t("common.ui.operation.pending", { defaultMessage: "Pending" }),
    in_progress: t("common.ui.operation.inProgress", { defaultMessage: "In progress" }),
    completed: t("common.ui.operation.completed", { defaultMessage: "Completed" }),
  };
  return <Surface variant="outlined" padding={4} className={styles.root} data-sgui-part="operation-steps">
    {title && <Typography as="div" variant="subtitle1">{title}</Typography>}
    {subtitle && <Typography as="div" variant="body2" tone="muted">{subtitle}</Typography>}
    <ol className={styles.steps}>
      {steps.map(step => <li className={styles.step} key={step.id} data-status={step.status}>
        {step.status === "in_progress" ? <Progress variant="circular" aria-label={step.label} className={styles.spinner} /> :
          <span className={styles.icon} aria-hidden="true">{step.status === "completed" ? <CheckIcon /> : <CircleIcon />}</span>}
        <Typography as="span" variant="body2" tone={step.status === "pending" ? "muted" : "default"}>
          {step.label}<span className={styles.srOnly}>: {labels[step.status]}</span>
        </Typography>
      </li>)}
    </ol>
  </Surface>;
}

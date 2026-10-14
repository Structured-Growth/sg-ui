"use client";
import { Link } from "../../experimental/Link/Link";
import { Avatar } from "../../experimental/Avatar/Avatar";
import { Typography } from "../../experimental/Typography/Typography";
import { AutoStoriesIcon } from "../../experimental/icons/AutoStoriesIcon";
import { CalendarTodayIcon } from "../../experimental/icons/CalendarTodayIcon";
import { useTranslation } from "../../i18n";
import { ClassCardFrame } from "../ClassCardFrame";
import styles from "./InstructorClassCard.module.css";

export type InstructorClassCardStatus = "active" | "draft" | "closed" | "archived";

export type InstructorClassCardProps = {
  className: string;
  siteName: string;
  status: InstructorClassCardStatus;
  learnerCount: number;
  lastLearnerActivityLabel: string;
  actionLabel: string;
  actionHref: string;
};

const statusMeta: Record<InstructorClassCardStatus, { color: string; labelKey: string; defaultLabel: string }> = {
  active: { color: "action", defaultLabel: "Active", labelKey: "card.status.active" },
  archived: { color: "muted", defaultLabel: "Archived", labelKey: "card.status.archived" },
  closed: { color: "default", defaultLabel: "Closed", labelKey: "card.status.closed" },
  draft: { color: "action", defaultLabel: "Draft", labelKey: "card.status.draft" },
};

const toActionLabel = (label: string, tr: (key: string, defaultMessage: string) => string) => {
  if (label === "Open Class" || label === "Open Section") {
    return tr("card.action.openClass", "Open Section");
  }
  if (label === "Set Up Class" || label === "Set Up Section") {
    return tr("card.action.setUpClass", "Set Up Section");
  }
  if (label === "View Class" || label === "View Section") {
    return tr("card.action.viewClass", "View Section");
  }

  return label;
};

const toLastLearnerActivityLabel = (label: string, tr: (key: string, defaultMessage: string) => string) => {
  if (label === "No recent activity") {
    return tr("card.lastLearnerActivity.noneRecent", "No recent activity");
  }
  if (label === "Recent activity") {
    return tr("card.lastLearnerActivity.recent", "Recent activity");
  }

  return label;
};

export function InstructorClassCard({
  className,
  siteName,
  status,
  learnerCount,
  lastLearnerActivityLabel,
  actionLabel,
  actionHref,
}: InstructorClassCardProps) {
  const { t, useNamespace } = useTranslation();
  useNamespace("sections.instructor");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "sections.instructor" });
  const statusItem = statusMeta[status];
  const resolvedActionLabel = toActionLabel(actionLabel, tr);
  const resolvedLastLearnerActivityLabel = toLastLearnerActivityLabel(lastLearnerActivityLabel, tr);

  return <ClassCardFrame
    header={<div className={styles.header}>
      <Avatar alt="" fallback="HE" shape="square" className={styles.avatar} />
      <div className={styles.heading}>
        <Typography as="h3" variant="subtitle1">{className}</Typography>
        <Typography variant="body2" tone="muted">{siteName}</Typography>
      </div>
    </div>}
    body={<>
      <div className={styles.status} data-status={status}>
        <span aria-hidden="true" className={styles.statusMarker} data-tone={statusItem.color} />
        <Typography variant="body2">{tr(statusItem.labelKey, statusItem.defaultLabel)}</Typography>
      </div>
      {status !== "archived" && <>
        <div className={styles.row}><AutoStoriesIcon aria-hidden="true" className={styles.icon} />
          <Typography variant="body2">{t("card.learnersCount", { defaultMessage: "{count} Learners", namespace: "sections.instructor", values: { count: learnerCount } }).replace("{count}", String(learnerCount))}</Typography>
        </div>
        <div className={styles.row}><CalendarTodayIcon aria-hidden="true" className={styles.icon} />
          <Typography variant="body2">{t("card.lastLearnerActivity.label", { defaultMessage: "Last Learner Activity: {value}", namespace: "sections.instructor", values: { value: resolvedLastLearnerActivityLabel } }).replace("{value}", resolvedLastLearnerActivityLabel)}</Typography>
        </div>
      </>}
    </>}
    footer={<Link href={actionHref} className={styles.action} underline="none">{resolvedActionLabel}</Link>}
  />;
}

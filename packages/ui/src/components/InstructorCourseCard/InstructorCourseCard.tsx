"use client";
import { Link } from "../../experimental/Link/Link";
import { Avatar } from "../../experimental/Avatar/Avatar";
import { Typography } from "../../experimental/Typography/Typography";
import { AutoStoriesIcon } from "../../experimental/icons/AutoStoriesIcon";
import { CalendarTodayIcon } from "../../experimental/icons/CalendarTodayIcon";
import { useTranslation } from "../../i18n";
import { CourseCardFrame } from "../CourseCardFrame";
import styles from "./InstructorCourseCard.module.css";

export type InstructorCourseCardStatus = "active" | "draft" | "closed" | "archived";

export type InstructorCourseCardProps = {
  /** Displayed course name. */
  courseName: string;
  siteName: string;
  status: InstructorCourseCardStatus;
  learnerCount: number;
  lastLearnerActivityLabel: string;
  actionLabel: string;
  actionHref: string;
};

const statusMeta: Record<InstructorCourseCardStatus, { color: string; labelKey: string; defaultLabel: string }> = {
  active: { color: "action", defaultLabel: "Active", labelKey: "card.status.active" },
  archived: { color: "muted", defaultLabel: "Archived", labelKey: "card.status.archived" },
  closed: { color: "default", defaultLabel: "Closed", labelKey: "card.status.closed" },
  draft: { color: "action", defaultLabel: "Draft", labelKey: "card.status.draft" },
};

export function InstructorCourseCard({
  courseName,
  siteName,
  status,
  learnerCount,
  lastLearnerActivityLabel,
  actionLabel,
  actionHref,
}: InstructorCourseCardProps) {
  const { t, useNamespace } = useTranslation();
  useNamespace("sections.instructor");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "sections.instructor" });
  const statusItem = statusMeta[status];

  return <CourseCardFrame
    header={<div className={styles.header}>
      <Avatar alt="" fallback="HE" shape="square" className={styles.avatar} />
      <div className={styles.heading}>
        <Typography as="h3" variant="subtitle1">{courseName}</Typography>
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
          <Typography variant="body2">{t("card.learnersCount", { defaultMessage: "{count} Learners", namespace: "sections.instructor", values: { count: learnerCount } })}</Typography>
        </div>
        <div className={styles.row}><CalendarTodayIcon aria-hidden="true" className={styles.icon} />
          <Typography variant="body2">{t("card.lastLearnerActivity.label", { defaultMessage: "Last Learner Activity: {value}", namespace: "sections.instructor", values: { value: lastLearnerActivityLabel } })}</Typography>
        </div>
      </>}
    </>}
    footer={<Link href={actionHref} className={styles.action} underline="none">{actionLabel}</Link>}
  />;
}

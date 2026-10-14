"use client";
import { ArrowForwardIcon } from "../../experimental/icons/ArrowForwardIcon";
import { EventIcon } from "../../experimental/icons/EventIcon";
import { ExploreIcon } from "../../experimental/icons/ExploreIcon";
import { Link } from "../../experimental/Link/Link";
import { Button } from "../../experimental/Button/Button";
import { Avatar } from "../../experimental/Avatar/Avatar";
import { Progress } from "../../experimental/Progress/Progress";
import { Typography } from "../../experimental/Typography/Typography";
import { useTranslation } from "../../i18n";
import { ClassCardFrame } from "../ClassCardFrame";
import { formatDueDateLabel } from "./formatDueDateLabel";
import styles from "./LearnerClassCard.module.css";

export type LearnerClassCardProps = {
  courseName: string; instructorName: string; progressPercent: number;
  nextActivity: string; dueAt: string | Date; referenceNow?: Date;
  onContinue?: () => void; detailsHref?: string; continueHref?: string;
};
export function LearnerClassCard({ courseName, instructorName, progressPercent,
  nextActivity, dueAt, referenceNow, onContinue, detailsHref, continueHref }: LearnerClassCardProps) {
  const { locale, t, useNamespace } = useTranslation();
  useNamespace("sections.learner");
  const tr = (key: string, defaultMessage: string, values?: Record<string, string | number>) =>
    t(key, { defaultMessage, namespace: "sections.learner", values });
  const dueLabel = formatDueDateLabel(dueAt, referenceNow, { locale, t: tr });
  const detailsTarget = detailsHref ?? continueHref;
  const progress = Number.isFinite(progressPercent) ? Math.max(0, Math.min(100, progressPercent)) : 0;
  return <ClassCardFrame
    header={<div className={styles.header}>
      <Avatar alt="" fallback="HE" shape="square" className={styles.avatar} />
      <div className={styles.heading}>
        <Typography as="h3" variant="subtitle1">{courseName}</Typography>
        <Typography variant="body2" tone="muted">{instructorName}</Typography>
      </div>
    </div>}
    body={<>
      <div className={styles.progressRow}>
        <Progress className={styles.progress} value={progress} aria-label={tr("card.progress", "Course progress")} />
        <Typography as="span" variant="body1">{progress}%</Typography>
      </div>
      <div className={styles.row}><ExploreIcon aria-hidden="true" className={styles.icon} />
        <Typography variant="body2">{tr("card.upNext", "Up Next: {activity}", { activity: nextActivity })}</Typography>
      </div>
      <div className={styles.row}><EventIcon aria-hidden="true" className={styles.icon} />
        <Typography variant="body2">{dueLabel}</Typography>
      </div>
    </>}
    footerClassName={styles.footer}
    footer={<div className={styles.actions}>
      {detailsTarget ? <Link href={detailsTarget} className={styles.details} underline="none">{tr("card.details", "Details")}</Link> :
        <Button variant="text" density="compact">{tr("card.details", "Details")}</Button>}
      {continueHref ? <Link href={continueHref} target="_blank" rel="noopener noreferrer" onClick={onContinue} className={styles.continue} underline="none">
        <ArrowForwardIcon aria-hidden="true" className={styles.icon} />{tr("card.continue", "Continue")}
      </Link> : <Button variant="outlined" density="compact" onPress={onContinue} startIcon={<ArrowForwardIcon />}>
        {tr("card.continue", "Continue")}
      </Button>}
    </div>}
  />;
}

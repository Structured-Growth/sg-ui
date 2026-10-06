import Link from "../../adapters/Link";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircleIcon from "@mui/icons-material/Circle";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "../../i18n";
import { AppButton } from "../AppButton";
import { ClassCardFrame } from "../ClassCardFrame";

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
  active: { color: "success.main", defaultLabel: "Active", labelKey: "card.status.active" },
  archived: { color: "grey.400", defaultLabel: "Archived", labelKey: "card.status.archived" },
  closed: { color: "warning.main", defaultLabel: "Closed", labelKey: "card.status.closed" },
  draft: { color: "success.main", defaultLabel: "Draft", labelKey: "card.status.draft" },
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

  return (
    <ClassCardFrame
      body={
        <>
          <Box sx={{ alignItems: "center", display: "flex", gap: 1, mb: 1.5 }}>
            <CircleIcon sx={{ color: statusItem.color, fontSize: 14 }} />
            <Typography sx={{ fontSize: 30 / 2 }}>{tr(statusItem.labelKey, statusItem.defaultLabel)}</Typography>
          </Box>

          {status !== "archived" ? (
            <>
              <Box sx={{ alignItems: "center", display: "flex", gap: 1, mb: 1 }}>
                <AutoStoriesIcon color="action" fontSize="small" />
                <Typography sx={{ fontSize: 30 / 2 }}>
                  {tr("card.learnersCount", "{count} Learners").replace("{count}", String(learnerCount))}
                </Typography>
              </Box>

              <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
                <CalendarTodayIcon color="action" fontSize="small" />
                <Typography sx={{ fontSize: 30 / 2 }}>
                  {tr("card.lastLearnerActivity.label", "Last Learner Activity: {value}")
                    .replace("{value}", resolvedLastLearnerActivityLabel)}
                </Typography>
              </Box>
            </>
          ) : null}
        </>
      }
      footer={<AppButton component={Link} href={actionHref} size="small">{resolvedActionLabel}</AppButton>}
      header={
        <Box sx={{ alignItems: "center", display: "flex", gap: 1.75 }}>
          <Avatar sx={{ bgcolor: "grey.400", borderRadius: 1, height: 42, width: 42 }}>HE</Avatar>
          <Box>
            <Typography sx={{ fontSize: 32 / 2, fontWeight: 500 }}>{className}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 28 / 2 }}>
              {siteName}
            </Typography>
          </Box>
        </Box>
      }
    />
  );
}

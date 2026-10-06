import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventIcon from "@mui/icons-material/Event";
import ExploreIcon from "@mui/icons-material/Explore";
import Link from "../../adapters/Link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { useTranslation } from "../../i18n";
import { ClassCardFrame } from "../ClassCardFrame";
import { formatDueDateLabel } from "./formatDueDateLabel";

type LearnerClassCardProps = {
  courseName: string;
  instructorName: string;
  progressPercent: number;
  nextActivity: string;
  dueAt: string | Date;
  referenceNow?: Date;
  onContinue?: () => void;
  detailsHref?: string;
  continueHref?: string;
};

export function LearnerClassCard({
  courseName,
  instructorName,
  progressPercent,
  nextActivity,
  dueAt,
  referenceNow,
  onContinue,
  detailsHref,
  continueHref,
}: LearnerClassCardProps) {
  const { locale, t, useNamespace } = useTranslation();
  useNamespace("sections.learner");
  const tr = (key: string, defaultMessage: string, values?: Record<string, string | number>) =>
    t(key, { defaultMessage, namespace: "sections.learner", values });
  const dueLabel = formatDueDateLabel(dueAt, referenceNow, { locale, t: tr });
  const detailsButtonProps = (detailsHref ?? continueHref)
    ? ({ component: Link, href: detailsHref ?? continueHref } as const)
    : ({ component: "button" } as const);
  const continueButtonProps = continueHref
    ? ({ component: Link, href: continueHref, target: "_blank", rel: "noopener noreferrer" } as const)
    : ({ component: "button" } as const);

  return (
    <ClassCardFrame
      body={
        <>
          <Box sx={{ alignItems: "center", display: "flex", gap: 2, mb: 2 }}>
            <LinearProgress
              sx={{
                borderRadius: 999,
                flex: 1,
                height: 12,
              }}
              value={progressPercent}
              variant="determinate"
            />
            <Typography sx={{ fontSize: 16 }}>{progressPercent}%</Typography>
          </Box>

          <Box sx={{ alignItems: "center", display: "flex", gap: 1, mb: 1 }}>
            <ExploreIcon color="action" fontSize="small" />
            <Typography sx={{ fontSize: 30 / 2 }}>
              {tr("card.upNext", "Up Next: {activity}", { activity: nextActivity })}
            </Typography>
          </Box>

          <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
            <EventIcon color="action" fontSize="small" />
            <Typography sx={{ fontSize: 30 / 2 }}>{dueLabel}</Typography>
          </Box>
        </>
      }
      footer={
        <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button {...detailsButtonProps} size="small" sx={{ minWidth: 0 }} variant="text">
            {tr("card.details", "Details")}
          </Button>
          <Button
            {...continueButtonProps}
            onClick={onContinue}
            size="small"
            startIcon={<ArrowForwardIcon />}
            variant="outlined"
          >
            {tr("card.continue", "Continue")}
          </Button>
        </Box>
      }
      footerSx={{ p: 1.25 }}
      header={
        <Box sx={{ alignItems: "center", display: "flex", gap: 2 }}>
          <Avatar sx={{ bgcolor: "grey.400", borderRadius: 1, height: 44, width: 44 }}>HE</Avatar>
          <Box>
            <Typography sx={{ fontSize: 32 / 2, fontWeight: 500 }}>{courseName}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 28 / 2 }}>
              {instructorName}
            </Typography>
          </Box>
        </Box>
      }
    />
  );
}

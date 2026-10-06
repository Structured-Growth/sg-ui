import { Box, CircularProgress, Stack, Typography } from "../primitives";

export type AppOperationStepStatus = "pending" | "in_progress" | "completed";

export type AppOperationStep = {
  id: string;
  label: string;
  status: AppOperationStepStatus;
};

export type AppOperationStepsProps = {
  title?: string;
  subtitle?: string;
  steps: AppOperationStep[];
};

const statusGlyph: Record<Exclude<AppOperationStepStatus, "in_progress">, string> = {
  completed: "✓",
  pending: "○",
};

export function AppOperationSteps({ title, subtitle, steps }: AppOperationStepsProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        minWidth: 360,
        p: 2,
      }}
    >
      <Stack spacing={1.5}>
        {title ? <Typography variant="subtitle1">{title}</Typography> : null}
        {subtitle ? (
          <Typography color="text.secondary" variant="body2">
            {subtitle}
          </Typography>
        ) : null}
        <Stack spacing={1}>
          {steps.map((step) => (
            <Stack alignItems="center" direction="row" key={step.id} spacing={1.25}>
              {step.status === "in_progress" ? (
                <CircularProgress size={14} thickness={6} />
              ) : (
                <Typography color={step.status === "completed" ? "success.main" : "text.disabled"} variant="body2">
                  {statusGlyph[step.status]}
                </Typography>
              )}
              <Typography color={step.status === "pending" ? "text.secondary" : "text.primary"} variant="body2">
                {step.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

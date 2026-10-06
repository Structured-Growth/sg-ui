import { Box, LinearProgress, Typography } from "../primitives";

export type AppInlineProgressProps = {
  value: number;
  barWidth?: number | string;
};

export function AppInlineProgress({ value, barWidth }: AppInlineProgressProps) {
  const normalizedValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
      <LinearProgress
        sx={{
          borderRadius: 999,
          height: 12,
          width: barWidth ?? ((theme) => theme.spacing(7.5)),
        }}
        value={normalizedValue}
        variant="determinate"
      />
      <Typography variant="body2">{`${normalizedValue}%`}</Typography>
    </Box>
  );
}

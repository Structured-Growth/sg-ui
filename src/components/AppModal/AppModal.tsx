import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { DialogProps } from "@mui/material/Dialog";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export type AppModalStep = {
  current: number;
  total: number;
  label?: string;
};

export type AppModalAction = {
  label: string;
  onClick?: ButtonProps["onClick"];
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  disabled?: boolean;
  autoFocus?: boolean;
};

export type AppModalProps = {
  open: boolean;
  onClose?: DialogProps["onClose"];
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  disableEscapeKeyDown?: boolean;
  showCloseButton?: boolean;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  steps?: AppModalStep;
  primaryAction?: AppModalAction;
  secondaryAction?: AppModalAction;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  width?: number | string;
  height?: number | string;
  heightMode?: "auto" | "sm" | "md" | "lg";
  disableBackdropClose?: boolean;
  paperSx?: SxProps<Theme>;
};

const formatStepLabel = (steps: AppModalStep) => {
  if (steps.label) {
    return steps.label;
  }

  return `Step ${steps.current} of ${steps.total}`;
};

export function AppModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "sm",
  fullWidth = true,
  disableEscapeKeyDown = false,
  showCloseButton = false,
  headerContent,
  footerContent,
  steps,
  primaryAction,
  secondaryAction,
  size,
  width,
  height,
  heightMode = "auto",
  disableBackdropClose = false,
  paperSx,
}: AppModalProps) {
  const resolvedSize = size ?? (maxWidth ?? "sm");
  const isLargeModal = resolvedSize === "xl";
  const isFullModal = resolvedSize === "full";
  const resolvedMaxWidth: DialogProps["maxWidth"] =
    isFullModal ? false : (resolvedSize as DialogProps["maxWidth"]);
  const hasCustomWidth = width !== undefined;
  const hasCustomHeight = height !== undefined;
  const presetHeight = heightMode === "sm"
    ? "56vh"
    : heightMode === "md"
      ? "68vh"
      : heightMode === "lg"
        ? "80vh"
        : undefined;
  const resolvedHeight = hasCustomHeight ? height : presetHeight;
  const hasHeader = Boolean(headerContent || title || subtitle || showCloseButton);
  const hasFooter = Boolean(footerContent || steps || primaryAction || secondaryAction);

  return (
    <Dialog
      disableEscapeKeyDown={disableEscapeKeyDown}
      fullScreen={isFullModal}
      fullWidth={fullWidth}
      maxWidth={resolvedMaxWidth}
      onClose={(event, reason) => {
        if (disableBackdropClose && reason === "backdropClick") {
          return;
        }
        onClose?.(event, reason);
      }}
      open={open}
      PaperProps={{
        sx: {
          ...(hasCustomWidth ? { width, maxWidth: "none" } : {}),
          ...(resolvedHeight ? { height: resolvedHeight } : {}),
          ...(isLargeModal
            ? {
                ...(resolvedHeight ? {} : { height: "92vh" }),
                ...(hasCustomWidth ? {} : { maxWidth: "96vw", width: "96vw" }),
              }
            : {}),
          ...paperSx,
        },
      }}
    >
      {hasHeader ? (
        <DialogTitle>
          <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
            <Box>
              {headerContent ?? (
                <>
                  {title ? <Typography variant="h4">{title}</Typography> : null}
                  {subtitle ? (
                    <Typography color="text.secondary" variant="body2">
                      {subtitle}
                    </Typography>
                  ) : null}
                </>
              )}
            </Box>
            {showCloseButton ? (
              <IconButton aria-label="Close" onClick={(event) => onClose?.(event, "escapeKeyDown")} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Stack>
        </DialogTitle>
      ) : null}

      <DialogContent dividers>{children}</DialogContent>

      {hasFooter ? (
        <DialogActions>
          <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }} variant="body2">
              {steps ? formatStepLabel(steps) : ""}
            </Typography>

            {footerContent ?? (
              <Stack direction="row" spacing={1}>
                {secondaryAction ? (
                  <Button
                    autoFocus={secondaryAction.autoFocus}
                    color={secondaryAction.color ?? "inherit"}
                    disabled={secondaryAction.disabled}
                    onClick={secondaryAction.onClick}
                    size="small"
                    variant={secondaryAction.variant ?? "text"}
                  >
                    {secondaryAction.label}
                  </Button>
                ) : null}

                {primaryAction ? (
                  <Button
                    autoFocus={primaryAction.autoFocus}
                    color={primaryAction.color ?? "primary"}
                    disabled={primaryAction.disabled}
                    onClick={primaryAction.onClick}
                    size="small"
                    variant={primaryAction.variant ?? "contained"}
                  >
                    {primaryAction.label}
                  </Button>
                ) : null}
              </Stack>
            )}
          </Box>
        </DialogActions>
      ) : null}
    </Dialog>
  );
}

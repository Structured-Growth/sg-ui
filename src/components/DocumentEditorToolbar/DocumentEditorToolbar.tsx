import type { ReactNode } from "react";
import AddIcon from "@mui/icons-material/Add";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import RemoveIcon from "@mui/icons-material/Remove";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "../AppButton";

export type DocumentEditorToolbarProps = {
  canEdit: boolean;
  headingValue: "normal" | "h1" | "h2" | "h3" | "h4" | "h5";
  onHeadingChange: (heading: "normal" | "h1" | "h2" | "h3" | "h4" | "h5") => void;
  zoomValue?: number;
  onZoomOut?: () => void;
  onZoomIn?: () => void;
  actions: {
    bold: { active: boolean; onClick: () => void };
    italic: { active: boolean; onClick: () => void };
    bulletList: { active: boolean; onClick: () => void };
    orderedList: { active: boolean; onClick: () => void };
  };
  statusLabel?: string;
  statusColor?: string;
  showZoomControls?: boolean;
  showAlignmentControls?: boolean;
  showCustomComponentAction?: boolean;
  rightSlot?: ReactNode;
};

export function DocumentEditorToolbar({
  canEdit,
  headingValue,
  onHeadingChange,
  zoomValue = 100,
  onZoomOut,
  onZoomIn,
  actions,
  statusLabel,
  statusColor,
  showZoomControls = true,
  showAlignmentControls = true,
  showCustomComponentAction = false,
  rightSlot,
}: DocumentEditorToolbarProps) {
  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
      <Stack alignItems="center" direction="row" spacing={1.25}>
        <Stack alignItems="center" direction="row" spacing={0.5} sx={{ bgcolor: "grey.100", borderRadius: 2, px: 1, py: 0.5 }}>
          {showZoomControls ? (
            <>
              <IconButton disabled={!onZoomOut} onClick={onZoomOut} size="small">
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 60, textAlign: "center" }} variant="body2">{`${zoomValue}%`}</Typography>
              <IconButton disabled={!onZoomIn} onClick={onZoomIn} size="small">
                <AddIcon fontSize="small" />
              </IconButton>
              <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
            </>
          ) : null}

          <Select
            disabled={!canEdit}
            onChange={(event: SelectChangeEvent<string>) => onHeadingChange(event.target.value as "normal" | "h1" | "h2" | "h3" | "h4" | "h5")}
            size="small"
            sx={{ minWidth: 88 }}
            value={headingValue}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="h1">H1</MenuItem>
            <MenuItem value="h2">H2</MenuItem>
            <MenuItem value="h3">H3</MenuItem>
            <MenuItem value="h4">H4</MenuItem>
            <MenuItem value="h5">H5</MenuItem>
          </Select>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

          <IconButton color={actions.bold.active ? "primary" : "default"} disabled={!canEdit} onClick={actions.bold.onClick} size="small">
            <FormatBoldIcon fontSize="small" />
          </IconButton>
          <IconButton color={actions.italic.active ? "primary" : "default"} disabled={!canEdit} onClick={actions.italic.onClick} size="small">
            <FormatItalicIcon fontSize="small" />
          </IconButton>
          <IconButton color={actions.bulletList.active ? "primary" : "default"} disabled={!canEdit} onClick={actions.bulletList.onClick} size="small">
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
          <IconButton color={actions.orderedList.active ? "primary" : "default"} disabled={!canEdit} onClick={actions.orderedList.onClick} size="small">
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>

          {showAlignmentControls ? (
            <>
              <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
              <IconButton disabled size="small">
                <FormatAlignLeftIcon fontSize="small" />
              </IconButton>
              <IconButton disabled size="small">
                <FormatAlignCenterIcon fontSize="small" />
              </IconButton>
              <IconButton disabled size="small">
                <FormatAlignRightIcon fontSize="small" />
              </IconButton>
              <IconButton disabled size="small">
                <FormatAlignJustifyIcon fontSize="small" />
              </IconButton>
            </>
          ) : null}

          {showCustomComponentAction ? (
            <>
              <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
              <AppButton disabled size="small" startIcon={<AddIcon fontSize="small" />} variant="text">
                Custom component
              </AppButton>
            </>
          ) : null}
        </Stack>
      </Stack>

      {rightSlot ?? (statusLabel ? (
        <Typography color={statusColor ?? "text.secondary"} variant="body2">
          {statusLabel}
        </Typography>
      ) : null)}
    </Stack>
  );
}
